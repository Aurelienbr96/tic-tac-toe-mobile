import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OSVG = (props: any) => {
  const circleLength = 2 * Math.PI * 40; // The circumference of the circle (2 * π * r)
  const strokeDashoffset = useSharedValue(circleLength);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(strokeDashoffset.value, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    }),
  }));

  useEffect(() => {
    strokeDashoffset.value = 0;
  });
  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      <AnimatedCircle
        cx="50"
        cy="50"
        r="40"
        rotation="-90"
        origin="50, 50"
        animatedProps={animatedProps}
        stroke="white"
        strokeWidth="16"
        fill="transparent"
        strokeDasharray={circleLength}
        strokeDashoffset={circleLength}
      />
    </Svg>
  );
};

export default OSVG;
