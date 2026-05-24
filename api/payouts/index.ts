import Axios from "@/api";
import { handleApiError } from "@/utils/api_error";

export interface IAdminPayoutPayload {
  amount: string;
  mobile_number: string;
  mobile_provider: "MTN" | "VOD" | "ATL";
  recipient_name: string;
  description?: string;
}

export interface IAdminPayout {
  id: string;
  reference: string;
  amount: string;
  mobile_number: string;
  mobile_provider: string;
  recipient_name: string;
  description: string;
  status: "pending" | "success" | "failed";
  paystack_recipient_code: string;
  paystack_transfer_code: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}

class PayoutsService {
  static sendAdminPayout = async (
    payload: IAdminPayoutPayload,
    idempotencyKey: string,
  ): Promise<IAdminPayout> => {
    try {
      const response = await Axios({
        url: `/api/v1/payments/admin-payout/`,
        method: "POST",
        data: payload,
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return response.data as IAdminPayout;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default PayoutsService;
