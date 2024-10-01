import { View, Text } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <Text className="text-3xl text-black font-bold">Friends</Text>
      </View>
      <MaterialTopTabs
        screenOptions={{
          tabBarContentContainerStyle: {
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
          name="friends"
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
          name="request"
          options={{
            title: "Request",
            tabBarLabel: ({ focused }) => (
              <Text
                className={`w-[100px] text-center font-bold ${
                  focused ? "text-black" : "text-gray-400"
                }`}
              >
                Request
              </Text>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="add-friend"
          options={{
            title: "Add Friend",
            tabBarLabel: ({ focused }) => (
              <Text
                className={`w-[100px] text-center font-bold ${
                  focused ? "text-black" : "text-gray-400"
                }`}
              >
                Add Friend
              </Text>
            ),
          }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
};

export default FriendsLayout;
