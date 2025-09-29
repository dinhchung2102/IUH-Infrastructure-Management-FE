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
import logoIUH from "../assets/logo/iuh_logo-positive-simplified.png";

export default function Footer() {
  const gradient =
    "linear-gradient(135deg, rgba(9,26,70,0.95) 0%, rgba(10, 49, 117, 0.95) 100%)";

  return (
    <Box
      component="footer"
      sx={{
        background: gradient,
        color: "grey.100",
        mt: 6,
        pt: { xs: 3, sm: 4 },
        pb: 2,
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        maxWidth: "100vw",
        width: "100%",
        overflow: "hidden", // Ngăn nội dung tràn ra ngoài
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          maxWidth: "100%",
        }}
      >
        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          {/* 1. Logo + Tên + Slogan */}
          <Grid item xs={12} sm={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={logoIUH}
                alt="Logo IUH"
                sx={{
                  height: { xs: 50, sm: 60, md: 70 },
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                  width: "auto",
                  maxWidth: "100%",
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.95)",
                    fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                    hyphens: "auto",
                  }}
                >
                  Phòng Quản Trị Trường Đại học Công nghiệp TP.HCM
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    mb: { xs: 1, sm: 2 },
                    color: "rgba(255,255,255,0.8)",
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                  }}
                >
                  "Nơi tri thức gắn liền thực tiễn"
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                ml: { xs: 0, sm: 2 },
                color: "rgba(255,255,255,0.7)",
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              IUH hướng tới môi trường học tập sáng tạo, hiện đại và hội nhập
              quốc tế.
            </Typography>
          </Grid>

          {/* 2. Liên kết nhanh */}
          <Grid item xs={6} sm={3} lg={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                mb: 2,
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
              }}
            >
              Liên kết nhanh
            </Typography>
            <Divider
              sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2, width: 40 }}
            />
            {[
              "Trang chủ",
              "Giới thiệu",
              "Cơ sở vật chất",
              "Tin tức",
              "Báo cáo sự cố",
              "Liên hệ",
            ].map((text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                display="block"
                sx={{
                  mb: { xs: 0.8, sm: 1 },
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                  transition: "0.3s",
                  wordBreak: "break-word",
                  "&:hover": { color: "rgba(255,255,255,0.9)" },
                }}
              >
                {text}
              </Link>
            ))}
          </Grid>

          {/* 3. Thông tin liên hệ */}
          <Grid item xs={6} sm={3} lg={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                mb: 2,
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
              }}
            >
              Liên hệ
            </Typography>
            <Divider
              sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2, width: 40 }}
            />

            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.2 }}>
              <LocationOn
                sx={{
                  mr: 1,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: { xs: "small", sm: "medium" },
                  mt: 0.2,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                12 Nguyễn Văn Bảo, phường 1, Gò Vấp, Thành phố Hồ Chí Minh
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
              <Phone
                sx={{
                  mr: 1,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: { xs: "small", sm: "medium" },
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                  wordBreak: "break-all",
                }}
              >
                +84-28-38940390
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Email
                sx={{
                  mr: 1,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: { xs: "small", sm: "medium" },
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                  wordBreak: "break-all",
                }}
              >
                contact@iuh.edu.vn
              </Typography>
            </Box>
          </Grid>

          {/* 4. Google Map */}
          <Grid item xs={12} sm={12} lg={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                mb: 2,
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
              }}
            >
              Vị trí
            </Typography>
            <Divider
              sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2, width: 40 }}
            />
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "200px", sm: "180px", lg: "160px" },
                borderRadius: 1,
                overflow: "hidden",
                maxWidth: "100%",
              }}
            >
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8582379826526!2d106.68427047510085!3d10.822158889329419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1759067572933!5m2!1sen!2s"
                sx={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: 1,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Footer dưới cùng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "rgba(255,255,255,0.1)",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
              textAlign: "center",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            © {new Date().getFullYear()} Phòng quản trị Trường Đại học Công
            nghiệp TP.HCM. Tất cả các quyền được bảo lưu.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            {[Facebook, LinkedIn, Twitter, Instagram].map((Icon, idx) => (
              <IconButton
                key={idx}
                color="inherit"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  minWidth: { xs: 36, sm: 40 },
                  minHeight: { xs: 36, sm: 40 },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s",
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
