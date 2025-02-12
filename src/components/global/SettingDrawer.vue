<template>
  <a-drawer
    v-model:open="showSetting"
    :title="$t('setting.title')"
    :width="drawerWidth"
    :data-theme="theme"
    :z-index="1001"
  >
    <div class="setting-container">
      <a-alert class="mb-4" :message="$t('setting.tip') + 'config/'" type="info" />

      <div :class="['action-buttons', { 'action-buttons-mobile': isMobile }]">
        <a-space :wrap="isMobile" :size="isMobile ? 8 : 'small'">
          <a-button @click="handleFileOpen">{{ $t('setting.open') }}</a-button>
          <a-button @click="handleDataRefresh">{{ $t('setting.refresh') }}</a-button>
          <a-button @click="handleFileCreate">{{ $t('setting.new') }}</a-button>
          <a-button :disabled="!fileInfo.currentFile" @click="handleFileSave">
            {{ $t('setting.save') }}
          </a-button>
          <a-button :disabled="!fileInfo.currentFile" @click="handleFileSaveAs">
            {{ $t('setting.saveAs') }}
          </a-button>
        </a-space>
      </div>

      <div class="file-info" v-if="fileInfo.currentFile">
        <a-descriptions :column="1" :size="isMobile ? 'small' : 'default'">
          <a-descriptions-item :label="$t('setting.fileName')">
            {{ fileInfo.fileName }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('setting.lastModified')">
            {{ formatDate(fileInfo.fileLastModified) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <div class="content-editor" v-if="fileContent">
        <div class="editor-header">{{ $t('setting.option') }}</div>
        <a-textarea
          v-if="typeof fileContent === 'string'"
          v-model:value="fileContent"
          :rows="isMobile ? 15 : 20"
          :auto-size="{ minRows: isMobile ? 8 : 10, maxRows: isMobile ? 20 : 30 }"
        />
        <pre v-else class="content-preview">{{ fileContent }}</pre>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';
import { useFileSystemAccess } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useThemeStore } from '@/stores/themeStore';
import { useSettingStore } from '@/stores/settingStore';
import { message } from 'ant-design-vue';

const settingStore = useSettingStore();
const themeStore = useThemeStore();
const { showSetting } = storeToRefs(settingStore);
const { theme } = themeStore;

const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 1024);
const drawerWidth = computed(() => {
  if (windowWidth.value <= 576) return '90%';
  if (windowWidth.value <= 1024) return 400;
  return 450;
});

const handleResize = () => (windowWidth.value = window.innerWidth);

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

const fileSystem = useFileSystemAccess({
  dataType: 'Text',
  types: [
    {
      description: 'Configuration Files',
      accept: {
        'text/javascript': ['.js'],
        'application/json': ['.json'],
        'text/yaml': ['.yaml', '.yml'],
      },
    },
  ],
  excludeAcceptAllOption: true,
});

const fileInfo = reactive({
  fileName: computed(() => fileSystem.fileName.value),
  fileLastModified: computed(() => fileSystem.fileLastModified.value),
  currentFile: computed(() => fileSystem.file.value),
});

const fileContent = computed({
  get: () => fileSystem.data.value,
  set: (value) => (fileSystem.data.value = value),
});

const formatDate = (date: number) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

const handleFileOpen = async () => {
  try {
    await fileSystem.open();
  } catch (err) {
    message.error('Failed to open file');
  }
};

const handleDataRefresh = async () => {
  try {
    await fileSystem.updateData();
    message.success('File refreshed');
  } catch (err) {
    message.error('Failed to refresh file');
  }
};

const handleFileCreate = async () => {
  try {
    await fileSystem.create();
  } catch (err) {
    message.error('Failed to create file');
  }
};

const handleFileSave = async () => {
  try {
    await fileSystem.save();
    message.success('File saved successfully');
  } catch (err) {
    message.error('Failed to save file');
  }
};

const handleFileSaveAs = async () => {
  try {
    await fileSystem.saveAs();
    message.success('File saved successfully');
  } catch (err) {
    message.error('Failed to save file');
  }
};
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;

  .action-buttons {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;

    &-mobile {
      justify-content: center;

      :deep(.ant-space) {
        width: 100%;
        .ant-space-item {
          .ant-btn {
            width: 100%;
          }
        }
      }
    }
  }

  .file-info {
    padding: 0.5rem;
    background-color: var(--background-secondary);
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .content-editor {
    .editor-header {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .content-preview {
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 0.9rem;
      padding: 0.5rem;
    }
  }
}

[data-theme='dark'] {
  --background-secondary: rgba(255, 255, 255, 0.04);
  color: #ffffff;
}

@media (max-width: 1024px) {
  .setting-container {
    gap: 0.8rem;
    padding: 0.3rem;
  }
}

@media (max-width: 576px) {
  .setting-container {
    gap: 0.6rem;

    .file-info {
      font-size: 0.8rem;
    }

    .content-preview {
      font-size: 0.8rem;
    }
  }
}
</style>
