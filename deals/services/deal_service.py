from django.db import transaction

from deals.models import Deal


class DealService:
    @staticmethod
    @transaction.atomic
    def create_deal(business, validated_data: dict):
        reward_type = validated_data["reward_type"]

        if reward_type == "commission" and not validated_data.get("customer_incentive"):
            raise ValueError("Commission deals require a customer incentive amount.")

        if reward_type == "no_reward" and not validated_data.get("no_reward_reason"):
            raise ValueError("No-reward deals require a justification reason.")

        deal = Deal.objects.create(
            business=business,
            deal_name=validated_data["deal_name"],
            deal_description=validated_data.get("deal_description", ""),
            reward_type=reward_type,
            customer_incentive=validated_data.get("customer_incentive"),
            no_reward_reason=validated_data.get("no_reward_reason"),
        )
        return deal
