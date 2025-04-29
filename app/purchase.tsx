import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { PuchaseBackground } from "@/app/components/theme/PurchaseBackground";
import { PurchaseHeader } from "@/app/components/purchase/PurchaseHeader";
import { Image, View, Text } from "react-native";
import { Button } from "@/app/components/ui/Button";

const Purchase = () => {
  return (
    <PuchaseBackground>
      <CustomSafeArea>
        <PurchaseHeader />
        <View className={"flex-1 justify-center"}>
          <View className={"flex flex-col items-center gap-5 px-4"}>
            <Image
              source={require("@/assets/images/purchase-icon.png")}
              className={"size-40"}
            />
            <Text
              className={
                "text-center font-brockmann text-2xl font-medium text-black dark:text-white"
              }
            >
              Want to keep chatting?{"\n"}Unlock her
            </Text>
            <View
              className={
                "mt-2.5 flex flex-col gap-6.5 rounded-3xl bg-foreground p-2 pb-5"
              }
            >
              <View
                className={
                  "flex flex-row items-center justify-between rounded-2xl border-[3px] border-blue bg-tertiary p-5"
                }
              >
                <Image
                  source={require("@/assets/images/endless-intimacy-icon.png")}
                  className={"h-12 w-28"}
                />
                <View className={"flex flex-col items-center"}>
                  <Text
                    className={"font-poppins text-4xl font-bold text-white"}
                  >
                    $15.99
                  </Text>
                  <Text className={"font-brockmann text-xs text-white"}>
                    Lifetime
                  </Text>
                </View>
              </View>
              <View className={"flex flex-col gap-4 px-7"}>
                <Text className={"font-inter font-medium text-white"}>
                  Everything in Endless Intimacy plus:
                </Text>
                <View className={"flex flex-col gap-2.5"}>
                  <View className={"flex w-full flex-row items-center gap-2.5"}>
                    <Image
                      source={require("@/assets/images/check-circle.png")}
                      className={"size-5"}
                    />
                    <Text className={"font-inter font-medium text-white"}>
                      Personalized Memory
                    </Text>
                  </View>
                  <View className={"flex w-full flex-row items-center gap-2.5"}>
                    <Image
                      source={require("@/assets/images/check-circle.png")}
                      className={"size-5"}
                    />
                    <Text className={"font-inter font-medium text-white"}>
                      Unlimited Chats
                    </Text>
                  </View>
                  <View className={"flex w-full flex-row items-center gap-2.5"}>
                    <Image
                      source={require("@/assets/images/check-circle.png")}
                      className={"size-5"}
                    />
                    <Text className={"font-inter font-medium text-white"}>
                      Persona Selection
                    </Text>
                  </View>
                </View>
                <View className={"flex w-full flex-row items-center gap-2.5"}>
                  <Image
                    source={require("@/assets/images/check-circle.png")}
                    className={"size-5"}
                  />
                  <Text className={"font-inter font-medium text-white"}>
                    enhanced emotional intelligence
                  </Text>
                </View>
              </View>
              <View className={"px-7"}>
                <Button classNames={"w-full bg-red"}>
                  <Text className={"text-white"}>Purchase</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </CustomSafeArea>
    </PuchaseBackground>
  );
};

export default Purchase;
