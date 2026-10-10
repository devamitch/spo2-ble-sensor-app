import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import PrimaryButton from "./PrimaryButton";
import GuideImage from "../../assets/GuidIllustation.png";
import { X, Check } from "lucide-react-native";
import { useAppStore } from "../../store/useAppStore";

import { COLORS } from "../../theme/colors";

interface StartScanModalProps {
  open: boolean;
  onClose: () => void;
  onStartScan: () => void;
}

const { PRIMARY, BG, SURFACE, TEXT, TEXT_MUTED, BORDER } = COLORS;

const StartScanModal: React.FC<StartScanModalProps> = ({
  open,
  onClose,
  onStartScan,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const setHideStartScanModal = useAppStore(
    (state) => state.setHideStartScanModal
  );

  const handleStart = async () => {
    if (dontShowAgain) {
      setHideStartScanModal(true);
    }
    onStartScan();
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={TEXT} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={GuideImage}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Ready to Measure?</Text>
            <Text style={styles.description}>
              Place your fingertip gently on the camera lens. Hold steady and
              relax.
            </Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.7}
              onPress={() => setDontShowAgain(!dontShowAgain)}
            >
              <View
                style={[
                  styles.checkbox,
                  dontShowAgain && styles.checkboxChecked,
                ]}
              >
                {dontShowAgain && <Check size={12} color={COLORS.WHITE} />}
              </View>
              <Text style={styles.checkboxLabel}>Don’t show again</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <PrimaryButton onClick={handleStart} style={styles.button}>
                Start Scan
              </PrimaryButton>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.BLACK_60,
    justifyContent: "center",
    alignItems: "center",
    padding: "8%",
  },
  modalContainer: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 1,
    borderColor: BORDER,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.SLATE_300,
    borderRadius: 6,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: SURFACE,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkboxLabel: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
});

export default StartScanModal;
