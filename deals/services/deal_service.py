from django.db import transaction

from deals.models import Deal

class DealService:
    @staticmethod
    @transaction.atomic
    def create_deal(business, validated_data: dict):
        reward_type = validated_data["reward_type"]
        poster_template = validated_data.get("poster_text")  # frontend sends selected option

        if reward_type == "commission":
            incentive = validated_data.get("customer_incentive")
            if not incentive:
                raise ValueError("Commission deals require a customer incentive amount.")

            if Deal.objects.filter(
                business=business,
                reward_type="commission",
                customer_incentive=incentive
            ).exists():
                raise ValueError("You already have a deal with this commission amount.")

            is_featured = True

            if poster_template:
                poster_text = poster_template.replace("{incentive}", str(incentive))
            else:
                poster_text = f"Earn {incentive}% commission by sharing this deal!"

        elif reward_type == "no_reward":
            reason = validated_data.get("no_reward_reason")
            if not reason:
                raise ValueError("No-reward deals require a justification reason.")
            is_featured = False

            poster_text = poster_template or "Exclusive offer — share now!"

        else:
            raise ValueError("Invalid reward type.")

        deal = Deal.objects.create(
            business=business,
            deal_name=validated_data["deal_name"],
            deal_description=validated_data.get("deal_description", ""),
            reward_type=reward_type,
            customer_incentive=validated_data.get("customer_incentive"),
            no_reward_reason=validated_data.get("no_reward_reason"),
            is_featured=is_featured,
            poster_text=poster_text,
        )
        return deal
