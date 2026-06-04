"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createKidneyLab } from "@/lib/api/kidney-lab";
import {
  createKidneyLabDefaultValues,
  createKidneyLabFormSchema,
  formValuesToApiBody,
  type CreateKidneyLabFormValues,
} from "@/schemas/kidney-lab";

export function CreateKidneyLabForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<CreateKidneyLabFormValues>({
    resolver: zodResolver(createKidneyLabFormSchema),
    defaultValues: createKidneyLabDefaultValues,
  });

  const onSubmit = async (values: CreateKidneyLabFormValues) => {
    const token = session?.accessToken;

    if (!token) {
      setErrorMessage("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
      return;
    }

    setErrorMessage(null);

    try {
      await createKidneyLab(token, formValuesToApiBody(values));
      router.push("/health");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
      setErrorMessage(message);
    }
  };

  return (
    <Box
      component="section"
      sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}

      <FormContainer
        formContext={form}
        onSuccess={onSubmit}
        FormProps={{ noValidate: true }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextFieldElement
              name="hn"
              label="HN (เลขผู้ป่วย)"
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextFieldElement
              name="lab_no"
              label="Lab No."
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextFieldElement
              name="test_date"
              label="Test Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" component="h2">
              Blood Test
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              name="blood_test.creatinine"
              label="Creatinine"
              type="number"
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid size={6}>
            <TextFieldElement
              name="blood_test.egfr"
              label="eGFR"
              type="number"
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" component="h2">
              Urine Test
            </Typography>
          </Grid>
          <Grid size={4}>
            <TextFieldElement
              name="urine_test.protein"
              label="Protein"
              fullWidth
              placeholder="Negative"
            />
          </Grid>
          <Grid size={4}>
            <TextFieldElement
              name="urine_test.blood"
              label="Blood"
              fullWidth
              placeholder="2+"
            />
          </Grid>
          <Grid size={4}>
            <TextFieldElement
              name="urine_test.bacteria"
              label="Bacteria"
              fullWidth
              placeholder="1+"
            />
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "กำลังบันทึก..." : "Save"}
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
