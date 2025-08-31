import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  LinkedIn,
  Instagram,
  Twitter,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";
;
import logoIUH from "../assets/logo/iuh_logo-rut-gon-1024x577.png";
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.900",
        color: "grey.100",
        mt: 4,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} columns={14}>
          {/* Logo + Thông tin */}
           <Grid tem size={{ xs: 14, sm: 5 }}>
             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src={logoIUH}
                alt="Logo IUH"
                sx={{ width: 60, height: 60, mr: 2}}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TPHCM
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: "success.main" }} fontSize="small" />
              <Typography variant="body2">
                Số 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1, color: "success.main" }} fontSize="small" />
              <Typography variant="body2">+84-28-38940390</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 1, color: "success.main" }} fontSize="small" />
              <Typography variant="body2">contact@iuh.edu.vn</Typography>
            </Box>

            <Divider sx={{ bgcolor: "success.main", mt: 2, width: "60%" }} />
          </Grid>

          {/* Cơ sở vật chất */}
          <Grid item size={{ xs: 14, sm: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Cơ sở vật chất
            </Typography>
            <Divider sx={{ bgcolor: "success.main", mb: 2, width: "60%" }} />
            <Link href="#" color="inherit" underline="hover" display="block">
              Phòng học
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Phòng thí nghiệm
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Thư viện
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Hội trường
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Khu thể thao
            </Link>
          </Grid>

          {/* Quản lý sử dụng */}
          <Grid item size={{ xs: 14, sm: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Quản lý sử dụng
            </Typography>
            <Divider sx={{ bgcolor: "success.main", mb: 2, width: "60%" }} />
            <Link href="#" color="inherit" underline="hover" display="block">
              Lịch đăng ký
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Hướng dẫn đặt phòng
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Quy định sử dụng
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Báo cáo sự cố
            </Link>
          </Grid>

          {/* Học vụ & Hỗ trợ */}
          <Grid item size={{ xs: 14, sm: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Học vụ & Hỗ trợ
            </Typography>
            <Divider sx={{ bgcolor: "success.main", mb: 2, width: "60%" }} />
            <Link href="#" color="inherit" underline="hover" display="block">
              Cổng thông tin sinh viên
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Lịch học - Lịch thi
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Đào tạo trực tuyến
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Liên hệ hỗ trợ
            </Link>
          </Grid>
        </Grid>

        {/* Footer dưới cùng */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "grey.800",
          }}
        >
          <Typography variant="body2" color="grey.500">
            Copyright © {new Date().getFullYear()} Trường Đại học Công nghiệp. All rights reserved.
          </Typography>
          <Box>
            <IconButton color="inherit" size="small">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" size="small">
              <LinkedIn />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Instagram />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
