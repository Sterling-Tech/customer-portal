'use client';

import {
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";

import { toast } from "react-toastify";



import { admitVisitor, verifyAccessCode, VisitorAccessCodeResponse } from "@/app/services/accessCode";
import AccessCodeResultCard from "@/app/components/accessCode/Visitors";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

// import { getErrorMessage } from "../../utils/getErrorMessage";

export default function AccessCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const [result, setResult] =
    useState<VisitorAccessCodeResponse | null>(
      null
    );
  const [loading, setLoading] = useState(false);
  const [admitting, setAdmitting] = useState(false);
  const [admitted, setAdmitted] = useState(false);


  // ==================================
  // VERIFY
  // ==================================

  const handleVerify = async () => {

    const cleanCode =
      code.trim();

    if (!cleanCode) {

      toast.error(
        "Please enter an access code."
      );

      return;
    }

    try {

      setLoading(true);
      setResult(null);
      setAdmitted(false);
      const response =
        await verifyAccessCode({
          code: cleanCode,
        });

      setResult(response);

      toast.success(
        "Access code verified successfully."
      );

    } catch (error) {

      console.error(error);

      // toast.error(
      //     getErrorMessage(error)
      // );

    } finally {

      setLoading(false);

    }
  };


  // ==================================
  // ADMIT
  // ==================================

  const handleAdmit = async () => {

    const cleanCode =
      code.trim();

    if (!cleanCode) {

      toast.error(
        "Please enter an access code."
      );

      return;
    }

    try {

      setAdmitting(true);

      const response =
        await admitVisitor({
          code: cleanCode,
        });

      setResult(response);

      setAdmitted(true);

      toast.success(
        "Visitor admitted successfully."
      );

    } catch (error) {

      console.error(error);

      // toast.error(
      //     getErrorMessage(error)
      // );

    } finally {

      setAdmitting(false);

    }
  };


  const handleKeyDown = (
    event: React.KeyboardEvent
  ) => {

    if (
      event.key === "Enter"
    ) {
      handleVerify();
    }

  };


  return (

    <Box
      className="min-h-screen w-full bg-white overflow-y-auto p-4 sm:p-6 md:p-12 lg:px-20"
    >

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <Box sx={{ mb: 3 }} className="flex items-center justify-between gap-3 shadow-sm rounded-lg border border-gray-100 bg-white p-4">
        <div>
          <Typography
            sx={{ fontWeight: 700 }}
            className="font-bold text-7xl text-black"
          >
            Visitor Access
          </Typography>

          <Typography
            sx={{ fontSize: 13}}
            className="text-sm text-indigo-500"
          >
            Verify visitor access codes and
            admit visitors at the gate.
          </Typography>
        </div>
        <Button onClick={() => {
          router.push("/access-code")
        }}>

         Back to Login
        </Button>
      </Box>


      {/* ========================= */}
      {/* CODE CARD */}
      {/* ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          py: 5
        }}

      >

        <CardContent>

          <Stack
            spacing={3}
          >

            <Stack
              direction="row"
              sx={{ spacing: 3, alignItems: "center" }}
              className="flex items-center gap-4"
            >

              <ConfirmationNumberIcon
                // color="primary"
                fontSize={"large"}
                className="text-indigo-500"
              />

              <Box>

                <Typography
                  sx={{ fontWeight: 700 }}
                >
                  Enter Access Code
                </Typography>

                <Typography
                  sx={{ fontSize: 13, color: "text.secondary" }}
                >
                  Enter the visitor's
                  six-digit access code.
                </Typography>

              </Box>

            </Stack>


            <Divider />


            <TextField
              fullWidth
              label="Access Code"
              placeholder="e.g. 093023"
              variant="outlined"
              className="text-indigo-500"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={handleKeyDown}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: 20,
                },
              }}
            />


            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              sx={{ spacing: 2, height: 50 }}
              className="flex flex-col gap-2 sm:flex-row"
            >

              <Button
                fullWidth
                variant="outlined"
                className="border border-indigo-500 border-solid text-indigo-500 hover:bg-indigo-50"
                onClick={
                  handleVerify
                }
                disabled={
                  loading ||
                  admitting ||
                  !code.trim()
                }
              >
                {loading
                  ? "Verifying..."
                  : "Verify Code"}
              </Button>


              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <LoginIcon />
                }
                onClick={
                  handleAdmit
                }
                disabled={
                  admitting ||
                  loading ||
                  !code.trim() ||
                  admitted
                }
              >
                {admitting
                  ? "Admitting..."
                  : admitted
                    ? "Visitor Admitted"
                    : "Admit Visitor"}
              </Button>

            </Stack>

          </Stack>

        </CardContent>

      </Card>


      {/* ========================= */}
      {/* WARNING */}
      {/* ========================= */}

      {!admitted && result && (

        <Alert
          severity="info"
          sx={{
            mt: 2,
          }}
        >
          Verification only checks the
          visitor's access code. Click
          <strong>
            {" Admit Visitor "}
          </strong>
          to consume the code and record
          the admission.
        </Alert>

      )}


      {/* ========================= */}
      {/* RESULT */}
      {/* ========================= */}

      {result && (

        <AccessCodeResultCard
          data={result}
          admitted={admitted}
        />

      )}

    </Box>
  );
}