/// <reference types="nativewind/types" />

import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
    pressed?: boolean;
  }
}