"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  mapCreateHealthFormToApi,
  type CreateHealthFormValues,
} from "@/features/health/map-create-health-form";
import { useCreateKidneyLab } from "@/features/health/use-create-kidney-lab";

const formSchema = z
  .object({
    hn: z.string().min(1, "กรอก HN"),
    lab_no: z.string().min(1, "กรอก Lab No."),
    test_date: z.string().min(1, "กรอกวันที่ตรวจ"),
    creatinine: z.number(),
    egfr: z.number(),
    protein: z.string(),
    blood: z.number(),
    bacteria: z.number(),
  })
  .superRefine((data, ctx) => {
    const hasBlood =
      !Number.isNaN(data.creatinine) || !Number.isNaN(data.egfr);
    const hasUrine =
      data.protein.trim() !== "" ||
      !Number.isNaN(data.blood) ||
      !Number.isNaN(data.bacteria);
    if (!hasBlood && !hasUrine) {
      ctx.addIssue({
        code: "custom",
        message: "กรอกผลเลือดหรือผลปัสสาวะอย่างน้อยหนึ่งส่วน",
        path: ["lab_no"],
      });
    }
  });

type Inputs = z.infer<typeof formSchema>;

export default function CreateHealthPage() {
  const createKidneyLab = useCreateKidneyLab();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hn: "",
      lab_no: "",
      test_date: "",
      creatinine: 0,
      egfr: 0,
      protein: "",
      blood: 0,
      bacteria: 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const body = mapCreateHealthFormToApi(data as CreateHealthFormValues);
    createKidneyLab.mutate(body);
  };
  return (
      <Container>
      <Typography sx={{ mb: 2 }} variant="h4" component="h1">
          Create Health Record
        </Typography>
      <Box component="section" sx={{ p: 2, border: '1px solid grey', borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
        {createKidneyLab.isError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createKidneyLab.error.message}
          </Alert>
        ) : null}
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="HN"
              variant="outlined"
              {...register("hn")}
              error={Boolean(errors.hn)}
              helperText={errors.hn?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Lab No."
              variant="outlined"
              {...register("lab_no")}
              error={Boolean(errors.lab_no)}
              helperText={errors.lab_no?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Test Date"
              type="date"
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }} 
              {...register("test_date")}
              error={Boolean(errors.test_date)}
              helperText={errors.test_date?.message}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4" component="h1">
              Blood Test
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Creatinine"
              variant="outlined"
                {...register("creatinine", { valueAsNumber: true })}
              error={Boolean(errors.creatinine)}
              helperText={errors.creatinine?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="eGFR"
              variant="outlined"
              {...register("egfr", { valueAsNumber: true })}
              error={Boolean(errors.egfr)}
              helperText={errors.egfr?.message}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4" component="h1">
              Urine Test
            </Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Protein"
              variant="outlined"
              {...register("protein")}
              error={Boolean(errors.protein)}
              helperText={errors.protein?.message}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Blood"
              variant="outlined"
              {...register("blood", { valueAsNumber: true })}
              error={Boolean(errors.blood)}
              helperText={errors.blood?.message}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Bacteria"
              variant="outlined"
              {...register("bacteria", { valueAsNumber: true })}
              error={Boolean(errors.bacteria)}
              helperText={errors.bacteria?.message}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          disabled={createKidneyLab.isPending}
        >
          {createKidneyLab.isPending ? "กำลังบันทึก..." : "Save"}
        </Button>
        </form>
      </Box>

      </Container>
  );
}