import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const XSVG = (props: any) => {
  // lineheight = √[(x2 - x1)² + (y2 - y1)²]
  const firstLineheight = Math.sqrt(
    Math.pow(90 - 10, 2) + Math.pow(90 - 10, 2),
  );

  const secondLineheight = Math.sqrt(
    Math.pow(10 - 90, 2) + Math.pow(90 - 10, 2),
  );
  const strokeDashoffset = useSharedValue(firstLineheight);
  const strokeDashoffsetLine2 = useSharedValue(secondLineheight);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(strokeDashoffset.value, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const animatedPropsline2 = useAnimatedProps(() => ({
    strokeDashoffset: withDelay(
      100,
      withTiming(strokeDashoffsetLine2.value, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
    ),
  }));

  useEffect(() => {
    strokeDashoffset.value = 0;
    strokeDashoffsetLine2.value = 0;
  });

  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      <AnimatedLine
        x1="10"
        y1="10"
        x2="90"
        y2="90"
        animatedProps={animatedProps}
        strokeDasharray={firstLineheight}
        strokeDashoffset={firstLineheight}
        stroke="#545454"
        strokeWidth="16"
      />
      <AnimatedLine
        animatedProps={animatedPropsline2}
        strokeDasharray={secondLineheight}
        strokeDashoffset={secondLineheight}
        x1="90"
        y1="10"
        x2="10"
        y2="90"
        stroke="#545454"
        strokeWidth="16"
      />
    </Svg>
  );
};

export default XSVG;
