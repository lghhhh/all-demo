<template>
 <a-page-header>
   <a-card
   style="margin-top:14px"
   :bordered="false"
   title="监控设置列表"
   >
    <div class="operate">
      <a-button type="primary"  @click="addFormVisible=true">添加新的数据监控规则</a-button>
    </div>
    <a-table :columns="columns" :data-source="observeData">
      <template #action="{ record }">
        <span>
          <a @click="deleteSetting(record)">删除</a>
          <a-divider type="vertical" />
          <!-- <a >编辑</a> -->
        </span>
      </template>
    </a-table>
   </a-card>

   <a-modal v-model:visible="addFormVisible" title="新增加配置" @ok="addFormSubmit">
      <template #footer>
        <a-button key="back" @click="addFormCancel">返回</a-button>
        <a-button key="submit" type="primary" :loading="addFormLoading" @click="onSubmit">提交配置</a-button>
      </template>
      <a-form ref="addFormRef" :model="addFormData" :rules="rules" :label-col="{span: 8}" :wrapper-col="{span:10}">
        <a-form-item label="监控城市" name="citySelected">
         <a-cascader
            v-model:value="addFormData.citySelected"
            :options="allCityData"
            :show-search="{ CityFilter}"
            @change="addFormCityChange"
            placeholder="请选择城市"
            />
        </a-form-item>
        <a-form-item label="监控开始时间" name="observeTimeStart">
          <a-time-picker v-model:value="addFormData.observeTimeStart"  format="HH:mm" valueFormat="HH:mm"/>
        </a-form-item>
        <a-form-item label="监控结束时间" name="observeTimeEnd">
          <a-time-picker v-model:value="addFormData.observeTimeEnd"  format="HH:mm" valueFormat="HH:mm"/>
        </a-form-item>
        <a-form-item label="数据波动大小" name="observeFluctuationRange">
          <a-input-number id="inputNumber" v-model:value="addFormData.observeFluctuationRange" :min="0" :max="100" />
        </a-form-item>
      </a-form>
    </a-modal>
 </a-page-header>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref, toRaw, UnwrapRef,
} from 'vue';
import {
  getAllSetting,
  addNewSttiong,
  // updateSetting,
  deleteSttiongById,
} from '@/api/observe-setting';
import { getAllCityData } from '@/api/road-data';

import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
import { notification } from 'ant-design-vue';

interface DataType {
  id?: number;
  CityId: number;
  CityName: string;
  MonitorFluctuationRange: number;
  MonitorTimeEnd: string;
  MonitorTimeStart: string;
}

interface FormState{
  citySelected: Array<number>;
  observeTimeStart: any;
  observeTimeEnd: any;
  observeFluctuationRange: number;
}
export default defineComponent({
  setup() {
    const addFormRef = ref();
    const addFormLoading = ref(false);
    const addFormVisible = ref(false);
    const observeData = ref([]);
    const rules = {
      citySelected: [{
        required: true, message: 'Please select city', type: 'array', trigger: 'change',
      }],
      observeTimeStart: [{
        required: true, message: 'Please select time', type: 'string', trigger: 'change',
      }],
      observeTimeEnd: [{
        required: true, message: 'Please select time', type: 'string', trigger: 'change',
      }],
      observeFluctuationRange: [{
        required: true, message: 'Please input a range', type: 'number', trigger: 'blur',
      }],
    };
    const columns = [
      {
        title: '规则序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '城市ID',
        dataIndex: 'CityId',
        key: 'CityId',
      },
      {
        title: '城市名',
        dataIndex: 'CityName',
        key: 'CityName',
      },
      {
        title: '开始监控时间',
        dataIndex: 'MonitorTimeStart',
        key: 'MonitorTimeStart',
      },
      {
        title: '结束监控时间',
        dataIndex: 'MonitorTimeEnd',
        key: 'MonitorTimeEnd',
      },
      {
        title: '监控的波动范围',
        dataIndex: 'MonitorFluctuationRange',
        key: 'MonitorFluctuationRange',
      },
      {
        title: 'Action',
        key: 'action',
        slots: { customRender: 'action' },
      },
    ];
    const addFormData : UnwrapRef<FormState> = reactive({
      citySelected: [],
      observeTimeStart: '',
      observeTimeEnd: '',
      observeFluctuationRange: 0,
    });
    const addFormSubmitData = reactive({
      CityId: 0,
      CityName: '',
      MonitorTimeEnd: '',
      MonitorTimeStart: '',
      MonitorFluctuationRange: 0,
    });
    const getAllSettingData = () => {
      getAllSetting().then((res) => {
        observeData.value = res.data;
      });
    };
    const onSubmit = () => {
      addFormRef.value
        .validate()
        .then(() => {
          addFormLoading.value = true;
          console.log('values', addFormData, toRaw(addFormData));
          addFormSubmitData.MonitorTimeStart = toRaw(addFormData).observeTimeStart;
          addFormSubmitData.MonitorTimeEnd = toRaw(addFormData).observeTimeEnd;
          addFormSubmitData.MonitorFluctuationRange = toRaw(addFormData).observeFluctuationRange;
          addNewSttiong(addFormSubmitData).then(() => {
            notification.open({
              message: 'Notification',
              description: '新增配置完成',
              onClick: () => {
                // console.log(' Clicked!');
              },
            });
            addFormVisible.value = false;
            addFormLoading.value = false;
            getAllSettingData();
          });
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    };

    return {
      addFormRef,
      rules,
      columns,
      observeData,
      addFormData,
      addFormSubmitData,
      onSubmit,
      addFormLoading,
      addFormVisible,
      getAllSettingData,
    };
  },
  data() {
    return {
      allCityData: [{
        label: '北京市',
        value: 10000,
      }],
    };
  },
  created() {
    getAllCityData().then((res) => {
      this.allCityData = res.data;
    });
    this.getAllSettingData();
  },
  methods: {
    CityFilter(inputValue:any, path:any) {
      return path.some((option:any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    // getAllSettingData() {
    //   getAllSetting().then((res) => {
    //     this.observeData = res.data;
    //   });
    // },
    deleteSetting(rowData:any) {
      const settingId = rowData.id;
      deleteSttiongById(settingId).then(() => {
        notification.open({
          message: 'Notification',
          description: '删除完成',
          onClick: () => {
            // console.log(' Clicked!');
          },
        });
        this.getAllSettingData();
      });
    },
    // addNewSttiong() {
    //   addNewSttiong(this.addFormSubmitData);
    // },
    addFormCityChange(value:any, selectedOptions:any) {
      this.addFormSubmitData.CityId = Number(value[value.length - 1]);
      this.addFormSubmitData.CityName = (selectedOptions[selectedOptions.length - 1]).label;
    },

  },
});
</script>
<style lang="less">
</style>
