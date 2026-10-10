import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ChevronRight, Heart, TrendingUp } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { AuthStackScreenProps } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string[];
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Precision Heart Rate',
    subtitle: 'Monitoring',
    description: 'Medical-grade PPG technology with 95%+ accuracy in under 10 seconds',
    icon: Heart,
    gradient: [COLORS.PRIMARY, COLORS.PRIMARY_DARK],
  },
  {
    id: 2,
    title: 'Advanced HRV',
    subtitle: 'Analytics',
    description: 'Deep cardiovascular insights with AI-powered stress detection',
    icon: Activity,
    gradient: [COLORS.PRIMARY, COLORS.PRIMARY_DARK],
  },
  {
    id: 3,
    title: 'Intelligent',
    subtitle: 'Predictions',
    description: 'AI-powered analytics for long-term health optimization',
    icon: TrendingUp,
    gradient: [COLORS.PRIMARY, COLORS.PRIMARY_DARK],
  },
];

type Props = AuthStackScreenProps<'Onboarding'>;

export function Onboarding({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Welcome');
    }
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const Icon = item.icon;

    return (
      <View style={styles.slide}>
        {/* Icon with gradient background */}
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Icon size={64} color="#FFF" strokeWidth={1.5} />
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          {/* <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subtitleGradient}
          > */}
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          {/* </LinearGradient> */}
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((slide, index) => {
          const dotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];

            const width = interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolate.CLAMP);

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolate.CLAMP
            );

            return { width, opacity };
          });

          return (
            <Animated.View key={index} style={[styles.dot, dotStyle]}>
              <LinearGradient
                colors={slide.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient */}
      <LinearGradient colors={[COLORS.BG, COLORS.BORDER]} style={StyleSheet.absoluteFill} />

      {/* Skip button */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom section */}
      <SafeAreaView edges={['bottom']} style={styles.bottom}>
        <Pagination />

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
          <LinearGradient
            colors={slides[currentIndex].gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <ChevronRight size={20} color={COLORS.TEXT_MUTED} strokeWidth={3} />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleGradient: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  button: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
