<template>
  <div class="error-container">
    <div class="error-content">
      <!-- 错误图标 -->
      <div class="error-icon">
        <div class="error-number">404</div>
        <font-awesome-icon icon="fa-solid fa-circle-question" class="question-icon" bounce />
      </div>

      <!-- 错误信息 -->
      <div class="error-message">
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
      </div>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <a-button type="primary" @click="goHome" class="action-button">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-house" />
          </template>
          Back to Home
        </a-button>

        <a-button @click="goBack" class="action-button">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
          </template>
          Go Back
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回首页
const goHome = () => {
  router.push('/');
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .error-content {
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    max-width: 500px;
    width: 100%;

    .error-icon {
      position: relative;
      margin-bottom: 30px;

      .error-number {
        font-size: 120px;
        font-weight: bold;
        background: linear-gradient(45deg, #ff6b6b, #556270);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: 'Arial', sans-serif;
        line-height: 1;
      }

      .question-icon {
        font-size: 40px;
        color: #ff6b6b;
        position: absolute;
        right: 50px;
        top: 20px;
        opacity: 0.8;
      }
    }

    .error-message {
      margin-bottom: 30px;

      h2 {
        font-size: 28px;
        color: #2c3e50;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        color: #7f8c8d;
        line-height: 1.6;
      }
    }

    .error-actions {
      display: flex;
      gap: 15px;
      justify-content: center;

      .action-button {
        min-width: 120px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .error-container {
    .error-content {
      padding: 30px 20px;

      .error-icon {
        .error-number {
          font-size: 80px;
        }

        .question-icon {
          font-size: 30px;
          right: 40px;
          top: 15px;
        }
      }

      .error-message {
        h2 {
          font-size: 24px;
        }

        p {
          font-size: 14px;
        }
      }

      .error-actions {
        flex-direction: column;

        .action-button {
          width: 100%;
        }
      }
    }
  }
}

// 深色模式支持
[data-theme='dark'] {
  .error-container {
    background: linear-gradient(135deg, #2d3436 0%, #2c3e50 100%);

    .error-content {
      background: rgba(30, 30, 30, 0.9);

      .error-message {
        h2 {
          color: #ecf0f1;
        }

        p {
          color: #bdc3c7;
        }
      }
    }
  }
}
</style>
