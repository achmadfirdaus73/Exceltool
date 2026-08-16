import { useState, useMemo, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { AggregatorType } from '../types';

export interface PivotChartProps {
  selectedRows: string[];
  selectedCols: string[];
  colValues: string[];
  groupedData: Record<string, Record<string, number[]>>;
  valueCol: string;
  aggregator: AggregatorType;
}

const COLOR_PALETTE = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#ef4444', // Red
];

type ChartType = 'bar' | 'stacked_bar' | 'line' | 'area' | 'pie';

export function PivotChartSection({
  selectedRows,
  selectedCols,
  colValues,
  groupedData,
  valueCol,
  aggregator,
}: PivotChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [showGrid, setShowGrid] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL');
  const chartRef = useRef<HTMLDivElement>(null);

  const calculateAgg = (arr: number[], agg: AggregatorType): number => {
    if (!arr || arr.length === 0) return 0;
    if (agg === 'Sum') return arr.reduce((a, b) => a + b, 0);
    if (agg === 'Count') return arr.length;
    if (agg === 'Average') return arr.reduce((a, b) => a + b, 0) / arr.length;
    if (agg === 'Max') return Math.max(...arr);
    if (agg === 'Min') return Math.min(...arr);
    return arr.reduce((a, b) => a + b, 0);
  };

  // Format data into recharts compatible array
  const { chartData, seriesKeys, totalGrandSum, maxItem } = useMemo(() => {
    const data: any[] = [];
    const keys = selectedCols.length > 0 ? colValues : ['Total'];
    let grandSum = 0;
    let maxVal = -Infinity;
    let maxLabel = '';

    Object.keys(groupedData || {}).forEach((rowKey) => {
      const item: Record<string, any> = {
        name: rowKey,
        shortName: rowKey.length > 15 ? rowKey.substring(0, 13) + '..' : rowKey,
      };

      let rowTotal = 0;
      keys.forEach((key) => {
        const arr = groupedData[rowKey]?.[key] || [];
        const val = calculateAgg(arr, aggregator);
        item[key] = Math.round(val * 100) / 100;
        rowTotal += val;

        if (val > maxVal) {
          maxVal = val;
          maxLabel = `${rowKey} (${key})`;
        }
      });

      item.GrandTotal = Math.round(rowTotal * 100) / 100;
      item.Total = Math.round(rowTotal * 100) / 100;
      grandSum += rowTotal;
      data.push(item);
    });

    return {
      chartData: data,
      seriesKeys: keys,
      totalGrandSum: grandSum,
      maxItem: { label: maxLabel || '-', val: maxVal === -Infinity ? 0 : maxVal },
    };
  }, [groupedData, colValues, selectedCols, aggregator]);

  // Pie chart specific data structure
  const pieData = useMemo(() => {
    return chartData.slice(0, 10).map((item) => ({
      name: item.name,
      value: selectedSeries === 'ALL' ? item.GrandTotal || item.Total || 0 : item[selectedSeries] || 0,
    }));
  }, [chartData, selectedSeries]);

  const activeSeriesToRender = useMemo(() => {
    if (selectedSeries === 'ALL') return seriesKeys;
    return [selectedSeries];
  }, [selectedSeries, seriesKeys]);

  const formatNumber = (num: number) => {
    if (num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <div
      id="pivot-chart-container"
      ref={chartRef}
      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
    >
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              📊 Grafik Visualisasi Pivot
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi otomatis [{aggregator} dari {valueCol}]
            </p>
          </div>
        </div>

        {/* Chart Type Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Kolom</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('stacked_bar')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              chartType === 'stacked_bar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bertumpuk</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              chartType === 'line'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Garis</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              chartType === 'area'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pie</span>
          </button>
        </div>
      </div>

      {/* Insight Metric Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-medium">Total Keseluruhan</span>
          <p className="text-sm sm:text-base font-bold text-emerald-600 font-mono">
            {formatNumber(totalGrandSum)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-medium">Rata-rata / Kategori</span>
          <p className="text-sm sm:text-base font-bold text-blue-600 font-mono">
            {formatNumber(chartData.length ? totalGrandSum / chartData.length : 0)}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 p-3 rounded-xl space-y-0.5 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-medium">Kategori Baris</span>
          <p className="text-sm sm:text-base font-bold text-purple-600 font-mono">
            {chartData.length} Kategori
          </p>
        </div>
      </div>

      {/* Recharts Canvas Box with explicit height for Android WebView / AppsGeyser */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 sm:p-4 min-h-[340px] flex items-center justify-center">
        <div className="w-full h-[320px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 35 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${(val / 1000000).toFixed(1)}M`
                      : val >= 1000
                      ? `${(val / 1000).toFixed(0)}k`
                      : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeSeriesToRender.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : chartType === 'stacked_bar' ? (
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 35 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${(val / 1000000).toFixed(1)}M`
                      : val >= 1000
                      ? `${(val / 1000).toFixed(0)}k`
                      : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeSeriesToRender.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                  />
                ))}
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 35 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${(val / 1000000).toFixed(1)}M`
                      : val >= 1000
                      ? `${(val / 1000).toFixed(0)}k`
                      : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeSeriesToRender.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 35 }}>
                <defs>
                  {activeSeriesToRender.map((key, index) => {
                    const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
                    return (
                      <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                      </linearGradient>
                    );
                  })}
                </defs>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${(val / 1000000).toFixed(1)}M`
                      : val >= 1000
                      ? `${(val / 1000).toFixed(0)}k`
                      : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {activeSeriesToRender.map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLOR_PALETTE[activeSeriesToRender.indexOf(key) % COLOR_PALETTE.length]}
                    fillOpacity={1}
                    fill={`url(#grad-${key})`}
                  />
                ))}
              </AreaChart>
            ) : (
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name.substring(0, 8)}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
