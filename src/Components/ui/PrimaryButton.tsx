import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { COLORS } from "../../theme/colors";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  style = {},
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled ? undefined : onClick}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
    textAlign: "center",
  },
});

export default PrimaryButton;
