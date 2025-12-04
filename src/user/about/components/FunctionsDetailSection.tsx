export function FunctionsDetailSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2
            className="mb-8 text-2xl sm:text-3xl font-bold uppercase"
            style={{ color: "#204195" }}
          >
            Chức năng
          </h2>

          <div className="space-y-8">
            {/* Chức năng tổng quát */}
            <div>
              <p className="text-base leading-relaxed text-muted-foreground mb-6 text-justify">
                Tham mưu và giúp Hiệu trưởng trong việc quản lý, tổng hợp, đề
                xuất ý kiến, tổ chức thực hiện việc quản lý toàn bộ hệ thống của
                trường về công tác quản trị, quản lý toàn bộ thiết bị của
                Trường, quản lý công tác đầu tư xây dựng.
              </p>
            </div>

            {/* Chức năng quản lý thiết bị */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Chức năng quản lý thiết bị:
              </h3>
              <ul className="space-y-3 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Quản lý toàn bộ hệ thống điện trong Trường.
                </li>
                <li className="text-justify">
                  Quản lý toàn bộ hệ thống cấp thoát nước trong Trường.
                </li>
                <li className="text-justify">
                  Quản lý toàn bộ các công trình kiến trúc trong Trường.
                </li>
                <li className="text-justify">
                  Tổng hợp, báo cáo, tư vấn về tình hình thiết bị, máy móc, công
                  trình kiến trúc trong Trường.
                </li>
                <li className="text-justify">
                  Phối hợp với các đơn vị liên quan quy hoạch, xây dựng và triển
                  khai các dự án đầu tư trang thiết bị của Trường.
                </li>
              </ul>
            </div>

            {/* Chức năng quản trị */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Chức năng quản trị:
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-4 text-justify">
                Tham mưu, giúp việc cho Hiệu trưởng thực hiện chức năng quản lý
                cơ sở hạ tầng của Trường. Phòng Quản trị chịu trách nhiệm trước
                Hiệu trưởng về công tác:
              </p>
              <ul className="space-y-3 text-base leading-relaxed text-muted-foreground list-disc list-inside">
                <li className="text-justify">
                  Quản lý hạ tầng kỹ thuật của Trường bao gồm: đất đai, nhà cửa,
                  lớp học, phòng làm việc, hội trường, phòng thí nghiệm, xưởng,
                  hệ thống giao thông nội bộ.
                </li>
                <li className="text-justify">
                  Lập kế hoạch, giám sát, tổ chức thực hiện sửa chữa nhỏ nhằm
                  duy trì chức năng, chống xuống cấp của cơ sở vật chất được
                  quản lý.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
