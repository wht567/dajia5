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
                default-value="2010-10-01"
              >
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="店铺">
            <el-select
              v-model="shopId"
              filterable
              placeholder="请选择店铺"
              @change="selectOne"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <draggable>
        <!-- <transition-group tag="div"> -->
        <el-col :span="8">
          <div id="gotobedbar"></div>
        </el-col>
        <el-col :span="8">
          <div id="gotobedbar1"></div>
        </el-col>
        <el-col :span="8">
          <div id="gotobedbar2"></div>
        </el-col>
        <el-col :span="8">
          <div id="gotobedbar3"></div>
        </el-col>
        <el-col :span="8">
          <div id="gotobedbar4"></div>
        </el-col>
        <el-col :span="8">
          <div id="gotobedbar5"></div>
        </el-col>
        <!-- </transition-group> -->
      </draggable>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import macarons from "echarts/theme/macarons";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { dateFormat } from "../../common/utils";
import * as api from "../../api";

const getBeforeDate = n => {
  var list = [];
  var d = new Date(); // 这个算法能自动处理闰年和非闰年。2012年是闰年，所以2月有29号
  var s = "";
  var i = 0;
  while (i < n) {
    d.setDate(d.getDate() - 1);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    list.push(
      year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
    );
    i++;
  }
  return list.reverse();
};

const option = {
  color: ["#70d1d5"],
  title: {
    text: "回复率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["回复率"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#70d1d5"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option1 = {
  title: {
    text: "评分",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["评分"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e90ff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      startValue: 5,
      endValue: 4
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "评分",
      type: "line",
      tiled: "总量",
      areaStyle: { normal: {} },
      data: (function() {
        var list = [];
        for (var i = 1; i <= 30; i++) {
          list.push(Math.round(Math.random() * 500) / 100);
        }
        return list;
      })()
    }
  ]
};
const option2 = {
  color: ["#70d1d5"],
  title: {
    text: "评价率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["评价率"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#70d1d5"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option3 = {
  color: ["#70d1d5"],
  title: {
    text: "差评率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["差评率"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#70d1d5"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option4 = {
  color: ["#70d1d5"],
  title: {
    text: "配送延迟率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["配送延迟率"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#70d1d5"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option5 = {
  color: ["#70d1d5"],
  title: {
    text: "商责取消订单数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["商责取消订单数"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#70d1d5"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
export default {
  name: "scoreDate",
  data() {
    return {
      date: "",
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 2924399,
          label: "古御贡茶•手抓饼•小吃（大芬信和店）"
        },
        {
          value: 4799060,
          label: "古御贡茶•手抓饼•小吃（龙岗罗马公元店）"
        },
        {
          value: 6119122,
          label: "古御贡茶•手抓饼•小吃（龙岗爱联店）"
        },
        {
          value: 6434760,
          label: "喜三德甜品•手工芋圆（龙岗爱联店）"
        },
        {
          value: 6914754,
          label: "古御贡茶•手抓饼•小吃（横岗店）"
        }
      ],
      shopId: -1
    };
  },
  methods: {
    dateChange() {
      console.log("修改时间");
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit();
    },
    selectOne(item) {
      window.sessionStorage.setItem("shop_info", item);
      this.onSubmit();
    },
    drawbar(option, id) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, "macarons");
      this.chart.setOption(option);
    },
    onSubmit() {
      console.log("date" + this.date);
      console.log("shopId" + this.shopId);
      if (this.date.length === 0 || this.shopId === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning"
        });
        return;
      }
      let times =
        "startTime=" +
        this.date[0] +
        "&endTime=" +
        this.date[1] +
        "&shopId=" +
        this.shopId;
      this.$http
        .get(api.MT_REPLYRATE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateBase(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
      this.$http
        .get(api.MT_SCORE_DATE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateScore(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
      this.$http
        .get(api.MT_EVRATE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateEv(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
      this.$http
        .get(api.MT_BADEVRATE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateBadEv(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
      this.$http
        .get(api.MT_SALE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateSale(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
    },

    updateBase(dateSours) {
      let lista = [];
      let lists = [];
      dateSours.forEach(function(value) {
        lista.push(value["insertDate"]);
        lists.push(parseFloat(value["reply"]));
      });
      console.log(lista);
      console.log(lists);
      option.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option.series = [
        {
          name: "回复率",
          type: "line",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: lists
        }
      ];

      this.drawbar(option, "gotobedbar");
    },

    updateScore(dateSours) {
      let lista = [];
      let lists = [];
      dateSours.forEach(function(value) {
        lista.push(value["date"]);
        lists.push(value["bizscore"]);
      });
      console.log(lista);
      console.log(lists);
      option1.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option1.series = [
        {
          name: "评分",
          type: "line",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: lists
        }
      ];

      this.drawbar(option1, "gotobedbar1");
    },

    updateEv(dateSours) {
      let lista = [];
      let lists = [];
      console.log("111111111111111");
      dateSours.forEach(function(value) {
        lista.push(value["date"]);
        lists.push(value["evaluation"]);
        console.log(value);
      });
      option2.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option2.series = [
        {
          name: "评价率",
          type: "line",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: lists
        }
      ];

      this.drawbar(option2, "gotobedbar2");
    },

    updateBadEv(dateSours) {
      let lista = [];
      let lists = [];
      console.log("22222222222");
      dateSours.forEach(function(value) {
        lista.push(value["date"]);
        lists.push(value["evaluation"]);
        console.log(value);
      });
      option3.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option3.series = [
        {
          name: "差评率",
          type: "line",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: lists
        }
      ];

      this.drawbar(option3, "gotobedbar3");
    },

    updateSale(dateSours) {
      let lista = [];
      let lists = [];
      let listn = [];
      console.log("3333333");
      let dates = Array.from(new Set(dateSours.map(v => v.insertDate)));

      for(let date of dates) {
        let value = dateSours.find(v=>v.insertDate == date)
        lista.push(value["insertDate"]);
        lists.push(value["distributionDelayRate"]);
        listn.push(value["negotiableOrderCancellation"]);
      }

      // console.log(dates)
      // dateSours.forEach(function(value) {
        
      //   console.log(value);
      // });
      option4.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option4.series = [
        {
          name: "配送延迟率",
          type: "line",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: lists
        }
      ];

      this.drawbar(option4, "gotobedbar4");

      option5.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option5.series = [
        {
          name: "商责取消订单数",
          type: "bar",
          tiled: "总量",
          areaStyle: { normal: {} },
          data: listn
        }
      ];

      this.drawbar(option5, "gotobedbar5");
    },

    getAllShop() {
      let shop_all = window.sessionStorage.getItem("user-all-info");
      if (shop_all) {
        this.options = JSON.parse(shop_all);
        return;
      }
      this.$http
        .get(api.MT_ALL_SHOP)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              let op = [
                {
                  value: -1,
                  label: "全部"
                }
              ];
              resData.forEach(function(va) {
                op.push({ value: va.wmpoiid, label: va.reptileType });
              });
              this.options = op;
              console.log(op);
              window.sessionStorage.setItem(
                "user-all-info",
                JSON.stringify(op)
              );
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch();
    }
  },
  mounted() {
    this.getAllShop();
    let shop_info = window.sessionStorage.getItem("shop_info");
    let changedate = window.sessionStorage.getItem("changedate");

    this.shopId = -1;
    console.log(shop_info);
    if (shop_info) {
      this.shopId = shop_info;
    }
    if (changedate) {
      this.date = changedate.split(",");
    } else {
      let dt = new Date();
      let endDate = dateFormat("YYYYmmdd", dt);
      dt.setDate(dt.getDate() - 30);
      let statrDate = dateFormat("YYYYmmdd", dt);
      console.log([statrDate, endDate]);
      this.date = [statrDate, endDate];
      window.sessionStorage.setItem("changedate", this.date);
    }

    this.$nextTick(function() {
      this.drawbar("gotobedbar");
      var that = this;
      var resizeTimer = null;
      window.onresize = function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          that.drawbar("gotobedbar");
        }, 300);
      };
    });
    this.onSubmit();
  }
};
</script>

<style scoped>
[id*="gotobedbar"] {
  width: 90%;
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
</style>
