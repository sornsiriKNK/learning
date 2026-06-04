"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useListKidneyLabs } from "@/features/health/use-list-kidney-labs";
import type { KidneyLabRecord } from "@/types/kidney-lab";

const tableHeader = [
  { label: "HN", align: "left" as const },
  { label: "Lab No.", align: "left" as const },
  { label: "วันที่ตรวจ", align: "left" as const },
  { label: "Creatinine", align: "right" as const },
  { label: "eGFR", align: "right" as const },
  { label: "Protein", align: "left" as const },
  { label: "Urine Blood", align: "left" as const },
  { label: "Bacteria", align: "left" as const },
  { label: "ผลผิดปกติ", align: "center" as const },
];

function formatCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
}

function KidneyLabTableRow({ row }: { row: KidneyLabRecord }) {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {row.hn}
      </TableCell>
      <TableCell>{row.lab_no}</TableCell>
      <TableCell>{row.test_date}</TableCell>
      <TableCell align="right">
        {formatCell(row.blood_test?.creatinine)}
      </TableCell>
      <TableCell align="right">{formatCell(row.blood_test?.egfr)}</TableCell>
      <TableCell>{formatCell(row.urine_test?.protein)}</TableCell>
      <TableCell>{formatCell(row.urine_test?.blood)}</TableCell>
      <TableCell>{formatCell(row.urine_test?.bacteria)}</TableCell>
      <TableCell align="center">{row.has_abnormal ? "ใช่" : "ไม่"}</TableCell>
    </TableRow>
  );
}

export default function HealthPage() {
  const { data: records, isLoading, isError, error } = useListKidneyLabs();

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={10}>
          <Typography variant="h4" component="h1">
            Health
          </Typography>
        </Grid>
        <Grid size={2}>
          <Link
            href="/health/create"
            style={{ display: "block", width: "100%", textDecoration: "none" }}
          >
            <Button variant="contained" fullWidth>
              New Record
            </Button>
          </Link>
        </Grid>
      </Grid>

      {isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      ) : null}

      <TableContainer component={Paper}>
        <Table
          stickyHeader
          sx={{ minWidth: 650, border: "1px solid #000", borderRadius: 1 }}
          aria-label="kidney lab records"
        >
          <TableHead>
            <TableRow>
              {tableHeader.map((item) => (
                <TableCell key={item.label} align={item.align}>
                  {item.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={tableHeader.length} align="center">
                  <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && records?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tableHeader.length} align="center">
                  ยังไม่มีข้อมูล — กด New Record เพื่อเพิ่มผลตรวจ
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading &&
              (records ?? []).map((row: KidneyLabRecord) => (
                <KidneyLabTableRow key={row.id} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
