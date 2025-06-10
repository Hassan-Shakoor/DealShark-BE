export const getAvatarImage = (gender: string) => {
  switch (gender) {
    case "male":
      return require("@/assets/images/male-avatar.png");
    case "female":
      return require("@/assets/images/female-avatar.png");
    default:
      return require("@/assets/images/unknow-avatar.png");
  }
};
