export const options1 = {
    color: ['#02DAAA', '#FCC851', '#72EFE2', '#01CBCA', '#3E71FF', '#02015C'],
    // tooltip: {
    //     trigger: 'item'
    // },
    tooltip: {
        trigger: 'item',
        formatter: param => {
            return [`${param.data?.name}`, `数量：${param.data?.value}`, `占比：${param.data?.percent.toFixed(0)}%`].join("<br/>")
        },
    },
    legend: {
        type: 'scroll',
        orient: 'horizontal',
        top: '0',
        right: '0',
        formatter: param => {
            return param
        }
    },
    series: [
        {
            // name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            // center: ['30%', '45%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                // { value: 1048, name: 'Search Engine' },
                // { value: 735, name: 'Direct' },
                // { value: 580, name: 'Email' },
                // { value: 484, name: 'Union Ads' },
                // { value: 300, name: 'Video Ads' }
            ]
        }
    ]
};
export const options2 = {
    tooltip: {
        trigger: "item",
        formatter: param => {
            return param.dimensionNames
                .map((el, i) => {
                    if (i == 0) {
                        return `${el}：${param.data[i]}`;
                    }
                    return `${el}：${param.data[i]}`;
                })
                .join("<br/>");
        }
    },
    grid: {//设置图表四周留白间距
        top: '2%',
        right: '2%',
        bottom: '10%',
        left: '0',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴刻度线
        },
    },
    yAxis: {
        type: 'category',
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴刻度线
        },
    },
    dataset: {
        source: []
    },
    series: [
        {
            name: '销量',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
                normal: {
                    color: function (params) {
                        let colorList = ['#02DAAA', '#FCC851', '#72EFE2', '#01CBCA', '#3E71FF', '#02015C']
                        return colorList[params.dataIndex]
                    }
                }
            }
        }
    ]
};
export const options3 = {
    color: ['#02DAAA', '#FCC851', '#72EFE2', '#01CBCA', '#3E71FF', '#02015C'],
    tooltip: {
        trigger: 'item',
        formatter: param => {
            return [`${param.data?.name}`, `数量：${param.data?.value}`, `占比：${param.data?.percent.toFixed(0)}%`].join("<br/>")
        },
    },
    legend: {
        top: '0',
        right: 0,
        type: 'scroll',
        orient: 'horizontal',
        formatter: param => {
            return param
        }
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            // center: ['30%', '45%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                // { value: 1048, name: 'Search Engine' },
                // { value: 735, name: 'Direct' },
                // { value: 580, name: 'Email' },
                // { value: 484, name: 'Union Ads' },
                // { value: 300, name: 'Video Ads' }
            ]
        }
    ]
};
export const options4 = {
    tooltip: {
        // trigger: "axis",
        trigger: "item",
        formatter: param => {
            return param.dimensionNames
                .map((el, i) => {
                    if (i == 0) {
                        return `${el}：${param.data[i]}`;
                    }
                    return `${el}：${param.data[i]}`;
                })
                .join("<br/>");
        }
    },
    grid: {//设置图表四周留白间距
        top: '12%',
        right: '4%',
        bottom: '10%',
        left: '4%'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,//设置x轴两边的留白
        name: "（天）",
        nameTextStyle: {
            color: '#000'
        },
        axisTick: { //x轴刻度尺
            show: false
        },
        axisLine: {//x轴线条颜色
            show: false,
            lineStyle: {
                color: '#999'
            }
        },
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
    },
    yAxis: {
        type: 'value',
        // max:10,//最大刻度值
        // interval:100,//刻度值间隔值
        splitLine: {//网格线
            show: true, //关闭网格线
            lineStyle: {
                type: 'dashed',    //设置网格线类型 dotted：虚线   solid:实线
                color: '#ededed'  //网格线颜色
            },
        },
        axisLine: {//y轴线条颜色
            show: false,
            lineStyle: {
                color: '#999'
            }
        },
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
    },

    dataset: {
        source: []
    },
    series: [{
        type: 'line',
        smooth: true,//面积图改成弧形状
        lineStyle: {
            width: 2,//外边线宽度
            color: '#3E71FF'//外边线颜色
        },
        showSymbol: false,//去除面积图节点圆
        areaStyle: {//区域填充渐变颜色
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    { offset: 0, color: 'rgba(62,113,255,.15)' }, // 0% 处的颜色 
                    { offset: 0.5, color: 'rgba(62,113,255,.1)' }, // 0% 处的颜色 
                    { offset: 1, color: 'rgba(62,113,255,.05)' }, // 50% 处的颜色 
                ],
                global: false // 缺省为 false
            }
        }
    }]
};