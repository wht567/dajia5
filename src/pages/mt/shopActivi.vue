<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间">
          <div class="block">
            <el-date-picker
              onchange="dateChange"
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
          <el-button type="primary" @click="onSubmit">查询全部</el-button>
          <el-button type="primary" @click="filterTable('满减')"
            >满减</el-button
          >
          <el-button type="primary" @click="filterTable('下单返券')"
            >下单返券</el-button
          >
          <el-button type="primary" @click="filterTable('收藏有礼')"
            >收藏有礼</el-button
          >
          <el-button type="primary" @click="filterTable('进店领券')"
            >进店领券</el-button
          >
          <el-button type="primary" @click="jpTable('减配')">减配</el-button>
          <el-button type="primary" @click="filterTable('新客立减')"
            >新客立减</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-table :data="tableData" border style="width: 100%" stripe  :default-sort = "{prop: 'insertDate', order: 'descending'}">
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- <el-table-column prop="id" label="ID" width="100"> </el-table-column> -->
        <el-table-column prop="wmpoiid" label="店铺id" width="100">
        </el-table-column>
        <el-table-column prop="actType" label="活动名称" width="100">
        </el-table-column>
        <el-table-column prop="policy" label="活动描述"> </el-table-column>

        <el-table-column prop="poiCharge" label="商家承担" > </el-table-column>
        <el-table-column prop="mtCharge" label="平台承担" > </el-table-column>
        <el-table-column prop="insertDate" label="查询时间" width="100" sortable> </el-table-column>
      </el-table>
    </el-col>

    <!-- <el-col :span="8">
      <div id="gotobedbar"></div>
    </el-col>

    <el-col :span="8">
      <div id="gotobedbar1"></div>
    </el-col> -->
  </el-row>
</template>

<script>
import * as api from "../../api";
import { dateFormat } from "../../common/utils";
import echarts from "echarts";

const getBeforeDate = (n) => {
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
  color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
  title: {
    text: "减配",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家承担", "美团承担"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e1eff", "#22bb22"],
    feature: {
      mark: { show: true },
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
    },
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: [],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [],
};
const option1 = {
  color: ["#22bb22", "#4b0082", "#d2691e"],
  title: {
    text: "新客立减",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家承担", "美团承担"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1efff4", "#22bb22"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
    },
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: [],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [],
};

export default {
  name: "foodAmount",
  data() {
    return {
      tableData: [],
      graphData: [],
      originData: [],
      jpData: [],
      date: "",
      options: [
        {
          value: -1,
          label: "全部",
        },
        {
          value: 2924399,
          label: "古御贡茶•手抓饼•小吃（大芬信和店）",
        },
        {
          value: 4799060,
          label: "古御贡茶•手抓饼•小吃（龙岗罗马公元店）",
        },
        {
          value: 6119122,
          label: "古御贡茶•手抓饼•小吃（龙岗爱联店）",
        },
        {
          value: 6434760,
          label: "喜三德甜品•手工芋圆（龙岗爱联店）",
        },
        {
          value: 6914754,
          label: "古御贡茶•手抓饼•小吃（横岗店）",
        },
      ],
      shopId: -1,
    };
  },
  computed: {
    allData() {
      return [...this.originData, ...this.graphData]
    }
  },
  methods: {
    dateChange() {
      console.log("修改时间");
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit();
    },

    selectOne(item) {
      window.sessionStorage.setItem("shop_info", item);
    },
    onSubmit() {
      if (this.date.length === 0 || this.shopId === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning",
        });
        return;
      }
      let times =
        "startTime=" +
        this.date[0] +
        "&endTime=" +
        this.date[1] +
        "&shopId=" +
        this.shopId +
        "&type=table";
      this.$http
        .get(api.MT_ACTIVITMY + "?" + times)
        .then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;
            if (resData.length > 0) {
              this.$message("操作成功");
              let dateList = [];
              this.tableData.push(...resData)
              this.originData = resData
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch((e) => {});
      let res =
        "startTime=" +
        this.date[0] +
        "&endTime=" +
        this.date[1] +
        "&shopId=" +
        this.shopId +
        "&type=graphs";
      this.$http
        .get(api.MT_ACTIVITMY + "?" + res)
        .then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;
            if (resData.length > 0) {
              this.$message("操作成功");
              this.jpData = resData;
              this.tableData.push(...resData)
              this.graphData = resData
              console.log(33333333)
              console.log(this.originData)
              this.updateBase(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch((e) => {});
    },
    getAllShop() {
      let shop_all = window.sessionStorage.getItem("user-all-info");
      if (shop_all) {
        this.options = JSON.parse(shop_all);
        return;
      }
      this.$http
        .get(api.MT_ALL_SHOP)
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              let op = [
                {
                  value: -1,
                  label: "全部",
                },
              ];
              resData.forEach(function (va) {
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
    },

    filterTable(type) {
      if (type == "满减") {
        let mjData = this.originData.filter((v) => v.actType == type);
        let mjDataDates = new Set(mjData.map((v) => v.insertDate));
        let mjDataByDate = [];
        for (let date of mjDataDates) {
          mjDataByDate.push({
            date,
            data: mjData.filter((v) => v.insertDate == date),
          });
        }
        let d = [];
        for (let dd of mjDataByDate) {
          d.push({
            id: dd.data.map((v) => v.id).join(","),
            wmpoiid: this.shopId,
            actType: "满减",
            policy: dd.data.map((v) => v.policy).join(", "),
            poiCharge: dd.data.map((v) => v.poiCharge).join(", "),
            mtCharge: dd.data.map((v) => v.mtCharge).join(", "),
            insertDate: dd.date,
          });
        }
        this.tableData = d;
      } else {
        this.tableData = this.allData.filter((v) => v.actType == type);
      }
    },
    jpTable(type) {
      this.tableData = this.jpData.filter((v) => v.actType == type);
    },
    updateBase(dateSours) {
      let jppoiCharge = [];
      let jpmtCharge = [];
      let jpmtdate = [];
      let xkpoiCharge = [];
      let xkmtCharge = [];
      let xkmtdate = [];
      dateSours.forEach(function (vr) {
        if (vr["actType"] === "减配") {
          jppoiCharge.push(vr["poiCharge"]);
          jpmtCharge.push(vr["mtCharge"]);
          jpmtdate.push(vr["insertDate"]);
        }
        if (vr["actType"] === "新客立减") {
          xkpoiCharge.push(vr["poiCharge"]);
          xkmtCharge.push(vr["mtCharge"]);
          xkmtdate.push(vr["insertDate"]);
        }
      });

      option.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: jpmtdate,
        },
      ];

      option.series = [
        {
          name: "商家承担",
          type: "line",
          tiled: "商家承担",
          areaStyle: { normal: {} },
          data: jppoiCharge,
        },
        {
          name: "美团承担",
          type: "line",
          tiled: "美团承担",
          areaStyle: { normal: {} },
          data: jpmtCharge,
        },
      ];

      option1.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: xkmtdate,
        },
      ];

      option1.series = [
        {
          name: "商家承担",
          type: "line",
          tiled: "商家承担",
          areaStyle: { normal: {} },
          data: xkpoiCharge,
        },
        {
          name: "美团承担",
          type: "line",
          tiled: "美团承担",
          areaStyle: { normal: {} },
          data: xkmtCharge,
        },
      ];

      this.drawbar("gotobedbar", option);
      this.drawbar("gotobedbar1", option1);
    },

    drawbar(id, option) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, "macarons");
      this.chart.setOption(option);
      return this.chart;
    },
    formatDates(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    formatdiscount() {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      if (data === "2") {
        return "是";
      } else {
        return "否";
      }
    },
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

    this.$nextTick(function () {
      this.drawbar("gotobedbar");
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar("gotobedbar");
        }, 300);
      };
    });
    this.onSubmit();
  },
};
</script>

<style scoped>
[id*=gotobedbar] {
min-height: 300px;
margin-right: 15px;
height: 300px !important;
}

.el-table__row {
  height: 1em;
}
</style>
