import { View, Text, SafeAreaView } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const FriendsLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex flex-row justify-between items-center px-6 pt-4">
        <Text className="text-3xl text-black font-bold">Inbox</Text>
      </View>
      <MaterialTopTabs
        screenOptions={{
          tabBarContentContainerStyle: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            textTransform: "none",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "black",
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="all"
          options={{
            title: "All",
            tabBarLabel: ({ focused }) => (
              <Text
                className={`w-[100px] text-center font-bold ${
                  focused ? "text-black" : "text-gray-400"
                }`}
              >
                All
              </Text>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="your-turn"
          options={{
            title: "Your Turn",
            tabBarLabel: ({ focused }) => (
              <Text
                className={`w-[100px] text-center font-bold ${
                  focused ? "text-black" : "text-gray-400"
                }`}
              >
                Your Turn
              </Text>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="waiting"
          options={{
            title: "Waiting",
            tabBarLabel: ({ focused }) => (
              <Text
                className={`w-[100px] text-center font-bold ${
                  focused ? "text-black" : "text-gray-400"
                }`}
              >
                Waiting
              </Text>
            ),
          }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
};

export default FriendsLayout;
