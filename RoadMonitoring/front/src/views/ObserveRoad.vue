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

import { Chart } from '@antv/g2';

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
  watch: {
    observeData(newData) {
      const formatData = newData.map((obj) => {
        const data = obj;
        const formatTime = `${this.timeValue?.format('YYYY-MM-DD')} ${obj.time}:00`;
        data.time = formatTime;
        return data;
      });
      this.observeContainer.changeData(formatData);
    },
  },
  created() {
    getAllCityData().then((res) => {
      this.allCityData = res.data;
    });
    this.timeValue = moment();
  },
  mounted() {
    this.loadObserveData();
    this.chartinit();
    // 创建图表
    // this.observeContainer = new Line('container', {
    //   data: this.observeData,
    //   padding: 'auto',
    //   xField: 'time',
    //   yField: 'ratio',
    //   seriesField: 'dataSource',
    //   smooth: true,
    // });
    // this.observeContainer.render();
  },
  methods: {
    chartinit() {
      // const time24 = [
      //   '00:00',
      //   '01:00',
      //   '02:00',
      //   '03:00',
      //   '04:00',
      //   '05:00',
      //   '06:00',
      //   '07:00',
      //   '08:00',
      //   '09:00',
      //   '10:00',
      //   '11:00',
      //   '12:00',
      //   '13:00',
      //   '14:00',
      //   '15:00',
      //   '16:00',
      //   '17:00',
      //   '18:00',
      //   '19:00',
      //   '20:00',
      //   '21:00',
      //   '22:00',
      //   '23:00',
      //   '24:00',
      // ];
      // const ticks = time24.map((time) => `${this.timeValue?.format('YYYY-MM-DD')} ${time}:00`);

      this.observeContainer = new Chart({
        container: 'container',
        autoFit: true,
        height: 500,
      });

      this.observeContainer.scale({
        time: {
          type: 'time',
          mask: 'HH:mm',
          showLast: true,
          // tickCount: 24,
          // ticks: time24,
          // maxTickCount: 2,
          tickInterval: 3600000,
        },
        ratio: {
          nice: true,
          formatter: (value) => Number(value).toFixed(3),
        },
      });
      this.observeContainer.axis('ratio', {
        label: {
          formatter: (val) => `${val} %`,
        },
      });

      this.observeContainer.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      this.observeContainer
        .line()
        .position('time*ratio')
        .color('dataSource')
        .shape('line'); // line  smooth
      this.observeContainer.data([]);

      this.observeContainer.render();
    },
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
