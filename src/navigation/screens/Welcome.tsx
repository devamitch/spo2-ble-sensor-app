import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Heart, Shield, Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../Components/ui/PrimaryButton';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../theme/colors';
import { AuthStackScreenProps } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = AuthStackScreenProps<'Welcome'>;

const Feature = ({
  icon: Icon,
  text,
  gradient,
  delay,
}: {
  icon: any;
  text: string;
  gradient: string[];
  delay: number;
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, delay });
    opacity.value = withTiming(1, { duration: 600, delay });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.featureCard, animatedStyle]}>
      <LinearGradient
        colors={[`${gradient[0]}15`, `${gradient[1]}10`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureGradient}
      >
        <View style={[styles.featureIcon, { backgroundColor: gradient[0] + '20' }]}>
          <Icon size={20} color={gradient[0]} strokeWidth={2.5} />
        </View>
        <Text style={styles.featureText}>{text}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export function Welcome({ navigation }: Props) {
  const setHasCompletedOnboarding = useAppStore((state) => state.setHasCompletedOnboarding);

  const pulse = useSharedValue(1);
  const heartRotate = useSharedValue(0);
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withSpring(1.1, { damping: 10 }), withSpring(1, { damping: 10 })),
      -1,
      false
    );

    heartRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    shimmer.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, false);
  }, []);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }, { rotate: `${heartRotate.value}deg` }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * (SCREEN_WIDTH + 100) }],
  }));

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient colors={['white', 'rgb(214, 218, 243)']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={heartStyle}>
            <LinearGradient
              colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Heart size={48} color="#FFF" strokeWidth={1.5} fill="#FFF" />
            </LinearGradient>
          </Animated.View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome to</Text>
            <View style={styles.brandContainer}>
              <Text style={styles.brandText}>SPO Health</Text>
              <Animated.View style={[styles.shimmer, shimmerStyle]} />
            </View>
          </View>

          <Text style={styles.subtitle}>
            Your personal heart health companion powered by advanced AI
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Feature
            icon={Activity}
            text="Real-time heart rate monitoring"
            gradient={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            delay={200}
          />
          <Feature
            icon={Shield}
            text="95%+ medical-grade accuracy"
            gradient={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            delay={400}
          />
          <Feature
            icon={Sparkles}
            text="AI-powered health insights"
            gradient={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            delay={600}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>No wearables needed. Just your phone's camera.</Text>
          </View>

          <PrimaryButton onClick={handleGetStarted}>Get Started</PrimaryButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0A0E27',
    backgroundColor: COLORS.BG,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    // color: 'rgba(255,255,255,0.7)',
    color: COLORS.TEXT_MUTED,
    letterSpacing: -0.3,
  },
  subtitleGradient: {
    marginTop: 8,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    // color: '#FFF',
    color: COLORS.PRIMARY,
    letterSpacing: -1,
    marginBottom: 8,
  },
  brandContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  brandText: {
    fontSize: 40,
    fontWeight: '900',
    // color: '#FFF',
    color: COLORS.PRIMARY,
    letterSpacing: -1,
  },
  shimmer: {
    position: 'absolute',
    left: -100,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  subtitle: {
    fontSize: 16,
    // color: 'rgba(255,255,255,0.6)',
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  features: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 12,
    justifyContent: 'center',
  },
  featureCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  infoText: {
    fontSize: 14,
    // color: 'rgba(255,255,255,0.8)',
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
});
