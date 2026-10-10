import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import bell from "../assets/bell.png";
import newspaper from "../assets/newspaper.png";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import { Dashboard } from "./screens/Dashboard";
import { HeartRateMeasuring } from "./screens/HeartRateMeasuring";
import { SessionDetail } from "./screens/SessionDetail";

import { HomeIcon, SettingsIcon } from "../Components/icons/TabIcons";
import { COLORS } from "../theme/colors";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Dashboard,
      options: {
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
      },
    },
    Settings: {
      screen: Settings,
      options: {
        title: "Settings",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <SettingsIcon color={color} size={size} />
        ),
      },
    },
  },
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      borderTopWidth: 0,
      elevation: 0,
      backgroundColor: COLORS.SURFACE,
    },
    tabBarActiveTintColor: COLORS.PRIMARY,
    tabBarInactiveTintColor: COLORS.TEXT_MUTED,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },

    HeartRateMeasuring: {
      screen: HeartRateMeasuring,
      options: {
        headerShown: false,
      },
    },
    SessionDetail: {
      screen: SessionDetail,
      options: {
        headerShown: false,
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
