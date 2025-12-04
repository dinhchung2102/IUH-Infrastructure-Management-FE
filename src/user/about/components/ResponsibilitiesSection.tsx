export function ResponsibilitiesSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2
            className="mb-8 text-2xl sm:text-3xl font-bold uppercase"
            style={{ color: "#204195" }}
          >
            Nhiệm vụ
          </h2>

          <div className="space-y-8">
            {/* Quản lý hệ thống thiết bị, máy móc */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng quản lý hệ thống thiết bị, máy móc:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Hướng dẫn, kiểm tra về chuyên môn, nghiệp vụ đối với công tác
                  quản lý thiết bị, máy móc, vật tư, hóa chất, điện thoại cho tất
                  cả các đơn vị trong Trường;
                </li>
                <li className="text-justify">
                  Tổ chức và triển khai sửa chữa, bảo trì, công tác kiểm kê, thanh
                  lý thiết bị;
                </li>
                <li className="text-justify">
                  Tổ chức và triển khai lắp đặt, sửa chữa điện thoại, mạng
                  internet, các thiết bị văn phòng trong Trường.
                </li>
              </ul>
            </div>

            {/* Quản lý hệ thống điện */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng quản lý hệ thống điện:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Tổ chức quản lý, vận hành, bảo trì, thay thế hệ thống điện tổng
                  thể trong Trường;
                </li>
                <li className="text-justify">
                  Tổ chức và triển khai sửa chữa, lắp đặt và cung cấp nguồn điện;
                  lắp đặt, theo dõi và ghi số công tơ đo đếm điện năng tiêu thụ
                  cho tất cả các đơn vị trong Trường.
                </li>
              </ul>
            </div>

            {/* Quản lý hệ thống cấp nước */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng quản lý hệ thống cấp nước:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Tổ chức quản lý, vận hành toàn bộ hệ thống cấp thoát nước trong
                  Trường;
                </li>
                <li className="text-justify">
                  Tổ chức và triển khai sửa chữa, lắp đặt và cung cấp nguồn nước;
                  lắp đặt, theo dõi và ghi số công tơ đo đếm nước tiêu thụ của
                  Trường cho tất cả các đơn vị trong Trường.
                </li>
              </ul>
            </div>

            {/* Tổng hợp, báo cáo, tư vấn */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng tổng hợp, báo cáo, tư vấn:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Tổng hợp, thống kê, báo cáo và tư vấn về tình hình thiết bị,
                  điện, nước, điện thoại, các thiết bị văn phòng trong Trường.
                </li>
                <li className="text-justify">
                  Tham gia Ban quản lý công sản, các Hội đồng, các Tổ công tác có
                  liên quan đến chức năng quản lý được giao và thực hiện các nhiệm
                  vụ khác do Hiệu trưởng phân công.
                </li>
              </ul>
            </div>

            {/* Quy hoạch, xây dựng, triển khai dự án */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng quy hoạch, xây dựng, triển khai các dự án đầu
                tư:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Xây dựng kế hoạch đầu tư ngắn hạn và dài hạn trang thiết bị trong
                  Trường;
                </li>
                <li className="text-justify">
                  Phối hợp Tổ chức đấu thầu mua sắm thiết bị theo các dự án và theo
                  các đề tài nghiên cứu khoa học.
                </li>
              </ul>
            </div>

            {/* Chức năng quản trị */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Thực hiện chức năng quản trị:
              </h3>
              <ul className="space-y-2 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Quản lý toàn bộ cơ sở hạ tầng đất đai, hàng rào, hệ thống giao
                  thông, hệ thống cống rãnh... thuộc phạm vi diện tích nhà trường,
                  ngăn ngừa những hành vi xâm phạm đất đai của trường, bảo vệ sự
                  toàn vẹn địa giới thuộc Trường quản lý.
                </li>
                <li className="text-justify">
                  Quản lý toàn bộ hệ thống nhà: nhà làm việc, xưởng trường, phòng
                  thí nghiệm, lớp học, hội trường, phòng khách, câu lạc bộ, sân bãi
                  thể dục thể thao... trong khu đất thuộc trường quản lý;
                </li>
                <li className="text-justify">
                  Quản lý, tu sửa, bảo dưỡng toàn bộ hệ thống cấp thoát nước trong
                  khuôn viên Trường.
                </li>
                <li className="text-justify">
                  Lập kế hoạch tu bổ, sửa chữa cơ sở vật chất của trường phục vụ
                  cho công tác đào tạo và nghiên cứu khoa học.
                </li>
                <li className="text-justify">
                  Phối hợp với các bộ phận chức năng liên quan nghiệm thu các công
                  trình xây dựng mới, các công trình sửa chữa, cải tạo, nhận bàn
                  giao và có kế hoạch đưa các công trình đó vào sử dụng có hiệu
                  quả.
                </li>
                <li className="text-justify">
                  Phối hợp lập kế hoạch sửa chữa và mua sắm đồ gỗ, trang bị nội
                  thất, đảm bảo tiện nghi phòng ốc phục vụ cho công tác và học tập
                  của viên chức, sinh viên toàn Trường.
                </li>
                <li className="text-justify">
                  Phối hợp với các bộ phận liên quan, tổ chức và triển khai công
                  tác phòng chống bão, lụt và phòng cháy chữa cháy của Trường.
                </li>
                <li className="text-justify">
                  Phối hợp chặt chẽ với Ban Xây dựng & Quản lý dự án, Ban Quản lý
                  công trình thực hiện tốt công tác quy hoạch và tham gia quản lý
                  xây dựng các công trình của Trường.
                </li>
                <li className="text-justify">
                  Trưởng phòng Quản trị (hoặc Phó Trưởng phòng) là uỷ viên thường
                  trực của các Hội đồng về các công trình xây dựng; phòng chống bão
                  lụt, phòng cháy, chữa cháy... của Trường.
                </li>
                <li className="text-justify">Thực hiện các nhiệm vụ khác do Hiệu trưởng phân công.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

