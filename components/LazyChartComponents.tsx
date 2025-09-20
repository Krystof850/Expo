import React, { lazy, Suspense } from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';

// Lazy load chart components from react-native-chart-kit for better performance
const BarChart = lazy(() => 
  import('react-native-chart-kit').then(module => ({ default: module.BarChart }))
);

const LineChart = lazy(() => 
  import('react-native-chart-kit').then(module => ({ default: module.LineChart }))
);

const { width } = Dimensions.get('window');

// Loading component for charts
const ChartLoader = ({ height = 200 }: { height?: number }) => (
  <View style={{
    width: width - 40,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 16,
    marginHorizontal: 20,
  }}>
    <ActivityIndicator size="large" color="#2563eb" />
  </View>
);

// Lazy-loaded BarChart wrapper
interface LazyBarChartProps {
  data: any;
  chartConfig: any;
  width?: number;
  height?: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  style?: any;
  [key: string]: any;
}

export const LazyBarChart: React.FC<LazyBarChartProps> = ({ 
  height = 200, 
  width: chartWidth = width - 40, 
  yAxisLabel = '',
  yAxisSuffix = '',
  ...props 
}) => (
  <Suspense fallback={<ChartLoader height={height} />}>
    <BarChart 
      {...props} 
      width={chartWidth} 
      height={height} 
      yAxisLabel={yAxisLabel}
      yAxisSuffix={yAxisSuffix}
    />
  </Suspense>
);

// Lazy-loaded LineChart wrapper
interface LazyLineChartProps {
  data: any;
  chartConfig: any;
  width?: number;
  height?: number;
  style?: any;
  [key: string]: any;
}

export const LazyLineChart: React.FC<LazyLineChartProps> = ({ 
  height = 200, 
  width: chartWidth = width - 40, 
  ...props 
}) => (
  <Suspense fallback={<ChartLoader height={height} />}>
    <LineChart {...props} width={chartWidth} height={height} />
  </Suspense>
);