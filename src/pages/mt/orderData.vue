<template>
  <div>

    <el-row>

      <el-col :span="24">

        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="时间">
            <div class="block">
              <el-date-picker
                @change="dateChange"
                v-model="date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
                default-value="2010-10-01">
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="店铺">
            <el-select v-model="shopId" filterable placeholder="请选择店铺" @change="selectOne">

              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>

        </el-form>


      </el-col>
      <el-col :span="24">
        <div id="gotobedbar"></div>
      </el-col>

      <el-col :span="24">
        <div id="gotobedbar1"></div>
      </el-col>

      <el-col :span="24">
        <div id="gotobedbar2"></div>
      </el-col>
      <el-col :span="24">
        <div id="gotobedbar3"></div>
      </el-col>
      <el-col :span="24">
        <div id="gotobedbar4"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import * as api from "../../api";
import {dateFormat} from "../../common/utils";
import echarts from "echarts";

const getBeforeDate = (n) => {
  var list = [];
  var d = new Date(); // 这个算法能自动处理闰年和非闰年。2012年是闰年，所以2月有29号
  var s = '';
  var i = 0;
  while (i < n) {
    d.setDate(d.getDate() - 1);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    list.push(year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day));
    i++;
  }
  return list.reverse();
}

const option = {
  title: {
    text: '美团店铺营业数据',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['营业额', '收入', '订单', '活动补贴'],
    orient: 'vertical',
    left: 'right',
    top: 'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
    x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                               // 'center' ¦ 'left' ¦ 'right'
                               // ¦ {number}（x坐标，单位px）
    y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                               // 'top' ¦ 'bottom' ¦ 'center'
                               // ¦ {number}（y坐标，单位px）
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
    feature: {
      mark: {show: true},
      // dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: 100,
      end: 1

    },
  ],
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '营业额',
      type: 'line',
      tiled: '总量',
      areaStyle: {normal: {}},
      data: function () {
        var list = [];
        for (var i = 1; i <= 30; i++) {
          list.push(Math.round(Math.random() * 500) / 100);
        }
        return list;
      }()
    }, {
      name: '收入',
      type: 'line',
      tiled: '总量',
      areaStyle: {normal: {}},
      data: function () {
        var list = [];
        for (var i = 1; i <= 30; i++) {
          list.push(Math.round(Math.random() * 500) / 100);
        }
        return list;
      }()
    }, {
      name: '订单',
      type: 'line',
      tiled: '总量',
      areaStyle: {normal: {}},
      data: function () {
        var list = [];
        for (var i = 1; i <= 30; i++) {
          list.push(Math.round(Math.random() * 500) / 100);
        }
        return list;
      }()
    }, {
      name: '活动补贴',
      type: 'line',
      tiled: '总量',
      areaStyle: {normal: {}},
      data: function () {
        var list = [];
        for (var i = 1; i <= 30; i++) {
          list.push(Math.round(Math.random() * 500) / 100);
        }
        return list;
      }()
    }]
}
export default {
  name: "orderData",
  data() {
    return {
      date: '',
      shopId: '',
      options: [],
    }
  },
  methods: {
    dateChange(){
      console.log('修改时间');
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit()
    },
    selectOne(item){
      window.sessionStorage.setItem("shop_info", item);
      this.onSubmit()
    },
    drawbar(id) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, 'macarons');
      this.chart.setOption(option);
    },
    onSubmit() {
      console.log('date' + this.date);
      console.log('shopId' + this.shopId);
      if (this.date.length === 0 || this.shopId === '') {
        this.$message({
          showClose: true,
          message: '请检查输入条件',
          type: 'warning'
        });
        return
      }
      let times = "startTime=" + this.date[0] + "&endTime=" + this.date[1] + "&shopId=" + this.shopId
      this.$http.get(api.MT_BUS_DATE + "?" + times)
        .then(res => {
          console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message('操作成功');
              this.updateBase(resData)
            } else {
              this.$message('数据为空')
            }
          }

        }).catch(e => {
        // this.$message('数据异常请联系管理员')
      })
    },

    updateBase(dateSours) {

      let lista = [];
      let turnovers = [];
      let effectiveorders = [];
      let settleacc = [];
      let actsubs = [];
      dateSours.forEach(function (value) {
        lista.push(value['date'])
        turnovers.push(value['turnover'])
        effectiveorders.push(value['effectiveorders'])
        settleacc.push(value['settleacc'])
        actsubs.push(value['actsub'])
      })
      console.log(lista)
      option.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option.series = [
        {
          name: '营业额',
          type: 'line',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: turnovers
        }, {
          name: '收入',
          type: 'line',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: settleacc
        }, {
          name: '订单',
          type: 'line',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: effectiveorders
        }, {
          name: '活动补贴',
          type: 'line',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: actsubs
        }]

      this.drawbar('gotobedbar');
    },

    getAllShop() {
      let shop_all = window.sessionStorage.getItem("user-all-info")
      if (shop_all){
        this.options = JSON.parse(shop_all)
        return
      }
      this.$http.get(api.MT_ALL_SHOP)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message('操作成功');
              let op = [{
                value: -1,
                label: '全部'
              }]
              resData.forEach(function (va) {
                op.push({value: va.wmpoiid, label: va.reptileType})
              });
              this.options = op
              console.log(op)
              window.sessionStorage.setItem("user-all-info", JSON.stringify(op));
            } else {
              this.$message('数据为空')
            }
          }
        }).catch(
      )
    },
  },

  mounted() {
    this.getAllShop()
    let shop_info = window.sessionStorage.getItem("shop_info")
    this.shopId = -1
    console.log(shop_info)
    if (shop_info){
      this.shopId = shop_info
    }
    let dt = new Date();
    let endDate = dateFormat("YYYYmmdd", dt)
    dt.setDate(dt.getDate() - 30)
    let statrDate = dateFormat("YYYYmmdd", dt)
    console.log([statrDate, endDate])
    this.date = [statrDate, endDate]

    this.$nextTick(function () {
      // this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar('gotobedbar');
        }, 300);
      }
    });
    this.onSubmit()
  }
}
</script>

<style scoped>

#gotobedbar {
[id*=gotobedbar] {
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
}
</style>
