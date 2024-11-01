import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "default" | "danger";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  variant = "default",
}) => {
  const buttonColorStyle =
    variant === "danger" ? styles.buttonDanger : styles.buttonDefault;

  return (
    <TouchableOpacity style={[buttonColorStyle, buttonStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonDefault: {
    backgroundColor: "#37a6fe",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonDanger: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomButton;
