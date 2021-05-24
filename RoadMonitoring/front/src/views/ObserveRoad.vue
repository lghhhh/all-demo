<template>
<a-page-header>
  <a-card>
    <div class="roadCard">
     <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '1px'}">
       <template #tabBarExtraContent>
          <a-cascader
            v-model:value="citySelected"
            :options="allCityData"
            :show-search="{ CityFilter }"
            placeholder="请选择城市"
            />
          <a-date-picker v-model:value="timeValue"  :style="{width: '128px'}" style="margin-left:10px" />
          <a-button @click="loadObserveData" type="primary" style="margin-left:10px" >加载数据</a-button>
       </template>
        <a-tab-pane loading="true" tab="道路非畅通占比%" key="1">
            <a-row type="flex" justify="space-around" align="middle">
              <a-col >
                非畅通数据里程比（%）
              </a-col>
            </a-row>
            <a-row>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <!-- <a-col> -->
              <div id="container"></div>
              </a-col>
            </a-row>
          </a-tab-pane>
     </a-tabs>
    </div>
  </a-card>
</a-page-header>
</template>

<script leng='ts'>
import { defineComponent } from 'vue';
import { getAllCityData, getRoadObserveData } from '@/api/road-data';
import { notification } from 'ant-design-vue';

import { Line } from '@antv/g2plot';
import moment from 'moment';

const ObserveData = defineComponent({
  data() {
    return {
      timeValue: '',
      observeData: [{
        ratio: 0,
        time: '00:00',
        dataSource: 'All',
      }],
      observeContainer: {}, // 图像容器
      allCityData: [{
        label: '北京市',
        value: 10000,
      }],
      citySelected: [10000],
      barData: [],

    };
  },
  // watch: {
  //   observeData() {

  //     // this.observeContainer.render();
  //   },
  // },
  created() {
    getAllCityData().then((res) => {
      this.allCityData = res.data;
    });
    this.timeValue = moment();
  },
  mounted() {
    this.loadObserveData();
    this.observeContainer = new Line('container', {
      data: this.observeData,
      padding: 'auto',
      xField: 'time',
      yField: 'ratio',
      seriesField: 'dataSource',
      smooth: true,
    });
    this.observeContainer.render();
  },
  methods: {
    CityFilter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    loadObserveData() {
      const citySelectedLen = this.citySelected?.length;
      if (!this.timeValue || !citySelectedLen) {
        this.openNotification('请加选择城市与日期');
        return;
      }
      const cityid = Number(this.citySelected[citySelectedLen - 1]);
      const time = this.timeValue?.format('YYYY-MM-DD');
      getRoadObserveData(cityid, time).then((res) => {
        this.observeData = res?.data?.data;
        this.observeContainer.update({
          data: this.observeData,
        });
      }).catch(() => this.openNotification('数据加载失败'));
    },
    openNotification(message) {
      console.log(message);
      notification.open({
        message: 'Notification',
        description:
          message,
        onClick: () => {
          // console.log(' Clicked!');
        },
      });
    },
  },
});
export default ObserveData;
</script>
