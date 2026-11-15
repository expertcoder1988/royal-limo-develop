"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminHeaders, backendURL } from "@/constants/bankendURL";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Loader from "./Loader";
import MySavedCards from "./MySavedCards";

export function PayAlert({
  open,
  setOpen,
  title,
  description,
  buttonTitle,
  bookingId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;

  buttonTitle: string;
  bookingId: string;
}) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState("");
  const [fetchingCards, setFetchingCards] = useState(true);
  const onSubmitComplete = () => {
    const resData = axios.post(
      `${backendURL}/pay/transaction`,
      {
        amount: amount,
        bookingId: bookingId,
        token: cardId,
      },
      {
        headers: AdminHeaders(),
      }
    );
    return resData;
  };
  const { mutateAsync: completeMutation, isPending } = useMutation({
    mutationFn: onSubmitComplete,
    onSuccess: () => {
      toast.success(`Payment of ${amount} has been successfully made!`, {
        description: "Payment has been successfully made!",
      });
      queryClient.invalidateQueries({ queryKey: ["bookingDetails"] });
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error?.response?.data?.errors,
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Loader isLoading={isPending} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-10">
              <p>{description}</p>
              <Input
                placeholder="Enter Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg placeholder:text-lg placeholder:text-gray-400 p-8"
              />
              <MySavedCards
                setCardId={setCardId}
                cardId={cardId}
                bookingId={bookingId}
                isAdmin={true}
                setFetchingCards={setFetchingCards}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="mx-3"
            disabled={isPending || fetchingCards}
          >
            No
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || fetchingCards || !cardId || !amount}
            onClick={() => {
              completeMutation();
              setOpen(false);
            }}
          >
            {buttonTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
