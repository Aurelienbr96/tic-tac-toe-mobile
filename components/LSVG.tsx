/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

type Props = {
  winner: any;
};

const LSVG = ({winner, ...props}: Props) => {
  // lineheight = √[(x2 - x1)² + (y2 - y1)²]
  const firstLineheight = Math.sqrt(
    Math.pow(90 - 10, 2) + Math.pow(90 - 10, 2),
  );

  const strokeDashoffset = useSharedValue(firstLineheight);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(strokeDashoffset.value, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    }),
  }));

  useEffect(() => {
    if (winner?.status && winner.status !== 'draw') {
      console.log('draw', winner?.status);
      strokeDashoffset.value = 0;
    } else {
      strokeDashoffset.value = firstLineheight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const getViewBoxPosition = () => {
    if (winner?.place?.diag === 0 || winner?.place?.diag === 1) {
      return {height: '120%', width: '120%'};
    }
    return {height: '100%', width: '100%'};
  };
  const getAxisPosition = () => {
    if (winner?.place?.row === 2) {
      return {x1: '0', x2: '100', y1: '84', y2: '84'};
    } // row2
    if (winner?.place?.row === 1) {
      return {x1: '0', x2: '100', y1: '50', y2: '50'}; // row2
    }
    if (winner?.place?.row === 0) {
      return {x1: '0', x2: '100', y1: '17', y2: '17'}; // row1
    }
    if (winner?.place?.col === 2) {
      return {x1: '84', x2: '84', y1: '0', y2: '100'}; // col 3
    }
    if (winner?.place?.col === 1) {
      return {x1: '50', x2: '50', y1: '0', y2: '100'}; // col 2
    }
    if (winner?.place?.col === 0) {
      return {x1: '17', x2: '17', y1: '0', y2: '100'}; // col 1
    }
    if (winner?.place?.diag === 1) {
      return {x1: '90', x2: '10', y1: '10', y2: '90'}; // diag from top right to bottom left
    }
    return {x1: '10', y1: '10', x2: '90', y2: '90'}; // diag from top left to bottom right
  };
  const getStrokeColor = () => {
    return winner?.status === 'o' ? 'white' : '#545454';
  };

  return (
    <Svg
      style={{position: 'absolute', display: !winner ? 'none' : 'flex'}}
      height={getViewBoxPosition().height}
      width={getViewBoxPosition().width}
      viewBox="0 0 100 100"
      {...props}>
      <AnimatedLine
        x1={getAxisPosition().x1}
        x2={getAxisPosition().x2}
        y1={getAxisPosition().y1}
        y2={getAxisPosition().y2}
        animatedProps={animatedProps}
        strokeDasharray={firstLineheight}
        strokeDashoffset={firstLineheight}
        stroke={getStrokeColor()}
        strokeWidth="3"
      />
    </Svg>
  );
};

export default LSVG;
