import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ChevronLeft, Mail, Phone, Save, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { ProfileStackScreenProps } from '../types';

type Props = ProfileStackScreenProps<'EditProfile'>;

interface FormField {
  id: string;
  icon: any;
  label: string;
  placeholder: string;
  value: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

export function EditProfile({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: 'Preetam',
    email: 'preetam@example.com',
    phone: '+91 98765 43210',
    dob: '15/03/1995',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const headerOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);
  const saveButtonScale = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    contentScale.value = withSpring(1, { damping: 15 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0], Extrapolate.CLAMP),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  const handleSave = () => {
    saveButtonScale.value = withSpring(0.95, { damping: 10 }, () => {
      saveButtonScale.value = withSpring(1, { damping: 10 });
    });

    // Simulate save and navigate back
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const fields: FormField[] = [
    {
      id: 'name',
      icon: User,
      label: 'Full Name',
      placeholder: 'Enter your name',
      value: formData.name,
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      placeholder: 'Enter your email',
      value: formData.email,
      keyboardType: 'email-address',
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Phone Number',
      placeholder: 'Enter your phone',
      value: formData.phone,
      keyboardType: 'phone-pad',
    },
    {
      id: 'dob',
      icon: Calendar,
      label: 'Date of Birth',
      placeholder: 'DD/MM/YYYY',
      value: formData.dob,
    },
  ];

  const InputField = ({ field, index }: { field: FormField; index: number }) => {
    const Icon = field.icon;
    const inputScale = useSharedValue(1);
    const borderColor = useSharedValue(0);

    const inputStyle = useAnimatedStyle(() => ({
      transform: [{ scale: inputScale.value }],
      borderColor: interpolateColor(borderColor.value, [0, 1], [COLORS.BORDER, COLORS.PRIMARY]),
    }));

    return (
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          { borderColor: focusedField === field.id ? COLORS.PRIMARY : COLORS.BORDER },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: COLORS.BLUE_50 }]}>
          <Icon size={18} color={COLORS.PRIMARY} strokeWidth={2} />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType={field.keyboardType || 'default'}
            onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
            onFocus={() => {
              setFocusedField(field.id);
              inputScale.value = withSpring(1.02, { damping: 15 });
              borderColor.value = withTiming(1, { duration: 200 });
            }}
            onBlur={() => {
              setFocusedField(null);
              inputScale.value = withSpring(1, { damping: 15 });
              borderColor.value = withTiming(0, { duration: 200 });
            }}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.TEXT} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={contentStyle}>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <User size={40} color={COLORS.WHITE} strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.infoText}>Update your personal information</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {fields.map((field, index) => (
                <InputField key={field.id} field={field} index={index} />
              ))}
            </View>

            {/* Save Button */}
            <Animated.View style={saveButtonStyle}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
                <LinearGradient
                  colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveGradient}
                >
                  <Save size={20} color={COLORS.WHITE} strokeWidth={2.5} />
                  <Text style={styles.saveText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.SLATE_100,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    padding: 0,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.WHITE,
    letterSpacing: 0.3,
  },
});
