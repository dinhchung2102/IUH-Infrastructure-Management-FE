import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ScienceIcon from "@mui/icons-material/Science";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import ImgBG from "../assets/logo/background.jpg";
import ImgNews from "../assets/logo/Hình-1_Campus-IUH.png";
export default function HomePage() {
  return (
    <Box>
      {/* Banner full width */}
      <Box
        sx={{
          width: "100%",
          height: "100vh", 
          pt: 8, 
          px: { xs: 2, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundImage: `url(${ImgBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {/* Card chức năng */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              bgcolor: "success.main",
              display: "inline-block",
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Danh mục cơ sở vật chất
            </Typography>
          </Box>

          <Box
            sx={{
              height: 2,
              bgcolor: "success.main",
              width: "100%",
            }}
          />
        </Box>

        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SchoolIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <CardContent>
                <Typography variant="h6">Phòng học</Typography>
                <Typography variant="body2" color="text.secondary">
                  Danh sách phòng học và tình trạng sử dụng
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <ScienceIcon
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <CardContent>
                <Typography variant="h6">Phòng thí nghiệm</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tra cứu, đặt lịch phòng thí nghiệm
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <LibraryBooksIcon
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <CardContent>
                <Typography variant="h6">Thư viện</Typography>
                <Typography variant="body2" color="text.secondary">
                  Không gian học tập và nghiên cứu
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SportsBasketballIcon
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <CardContent>
                <Typography variant="h6">Khu thể thao</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sân bóng, nhà thi đấu, thể dục thể thao
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lịch đăng ký */}
        <Box sx={{ mb: 3 }}>
          {/* Chữ trong nền xanh */}
          <Box
            sx={{
              bgcolor: "success.main",
              display: "inline-block",
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Lịch trực nhân viên
            </Typography>
          </Box>

          {/* Đường line nằm sát dưới */}
          <Box
            sx={{
              height: 2,
              bgcolor: "success.main",
              width: "100%",
            }}
          />
        </Box>

        <Box
          sx={{
            bgcolor: "grey.100",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 5,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Hiện chưa có lịch trực
          </Typography>
        </Box>

        {/* Tin tức */}
        {/* Tin tức */}
        <Box sx={{ mb: 3 }}>
          {/* Chữ trong nền xanh */}
          <Box
            sx={{
              bgcolor: "success.main",
              display: "inline-block",
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Tin tức & Thông báo
            </Typography>
          </Box>

          {/* Đường line nằm sát dưới */}
          <Box
            sx={{
              height: 2,
              bgcolor: "success.main",
              width: "100%",
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Tin nổi bật bên trái */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box
                component="img"
                src={ImgNews} 
                alt="Tin tức 1"
                sx={{ width: "100%", height: 250, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Now Is the Time to Think About Your Small-Business Success
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Armin Vans - June 19, 2019
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Woke reasonably late following the feast and free flowing
                  wine...
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tin nổi bật bên phải */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box
                component="img"
                src={ImgNews} 
                alt="Tin tức 2"
                sx={{ width: "100%", height: 250, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Radio Air Time Marketing: A New Strategy for the Economy
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Armin Vans - June 19, 2019
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Woke reasonably late following the feast and free flowing
                  wine...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
