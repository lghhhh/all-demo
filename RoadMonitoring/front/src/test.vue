<template>
  <a-space direction="vertical">
    <a-date-picker
      v-model:value="value1"
      format="YYYY-MM-DD HH:mm:ss"
      :disabled-date="disabledDate"
      :disabled-time="disabledDateTime"
      :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
    />
    <a-month-picker
      v-model:value="value2"
      :disabled-date="disabledDate"
      placeholder="Select month"
    />
    <a-range-picker
      style="width: 400px"
      v-model:value="value3"
      :disabled-date="disabledDate"
      :disabled-time="disabledRangeTime"
      :show-time="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
      }"
      format="YYYY-MM-DD HH:mm:ss"
    />
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const range = (start: number, end: number) => {
      const result = [];

      for (let i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    };

    const disabledDate = (current: Moment) =>
      // Can not select days before today and today
      current && current < moment().endOf('day');
    const disabledDateTime = () => ({
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    });

    const disabledRangeTime = (_: Moment[], type: 'start' | 'end') => {
      if (type === 'start') {
        return {
          disabledHours: () => range(0, 60).splice(4, 20),
          disabledMinutes: () => range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      }
      return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
      };
    };

    return {
      moment,
      value1: ref<Moment>(),
      value2: ref<Moment>(),
      value3: ref<Moment[]>([]),
      disabledDate,
      disabledDateTime,
      disabledRangeTime,
    };
  },
});
</script>
