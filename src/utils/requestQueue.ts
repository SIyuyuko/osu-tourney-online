export class RequestQueue {
  private queue: number[] = [];
  private processing: Set<number> = new Set();
  private maxConcurrent: number = 3;
  private controller: AbortController | null = null;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  setController(controller: AbortController) {
    this.controller = controller;
  }

  async push(ids: number[], callback: (id: number) => Promise<void>) {
    this.queue.push(...ids);

    while (this.queue.length > 0 && !this.controller?.signal.aborted) {
      if (this.processing.size < this.maxConcurrent) {
        const id = this.queue.shift()!;
        this.processing.add(id);
        this.processRequest(id, callback);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  private async processRequest(id: number, callback: (id: number) => Promise<void>) {
    try {
      await callback(id);
    } catch (error) {
      console.error(`Error processing request for id ${id}:`, error);
    } finally {
      this.processing.delete(id);
    }
  }

  clear() {
    this.queue = [];
    this.processing.clear();
    this.controller = null;
  }
}
