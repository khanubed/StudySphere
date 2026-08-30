import 'lucide-react-native';

declare module 'lucide-react-native' {
  export interface LucideProps {
    size?: number | string;
    color?: string;
    stroke?: string;
    fill?: string;
    strokeWidth?: number | string;
    className?: string;
  }
}
