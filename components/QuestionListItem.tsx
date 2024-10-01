import { Question } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";

interface QuestionListItemProps {
  question: Question;
}

const QuestionListItem = ({ question }: QuestionListItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(app)/friend-select",
          params: { question: JSON.stringify(question) },
        })
      }
      className="flex flex-row gap-x-4 py-2 bg-white rounded-lg shadow-xs items-center"
    >
      {question.thumbnail ? (
        <Image
          source={question.thumbnail}
          contentFit="cover"
          transition={1000}
          cachePolicy="memory-disk"
          style={{
            width: 60,
            height: 60,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#D1D5DB",
          }}
        />
      ) : (
        <View className="p-2">
          <Ionicons name="image-sharp" size={30} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-md font-medium">{question.text}</Text>
      </View>
    </Pressable>
  );
};

export default QuestionListItem;
