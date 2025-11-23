# API Documentation - Building & Area

## Building

### Get All Buildings

**Endpoint:** `GET /zone-area/buildings`

**Request Query Parameters:**

- `search` (optional): Tìm kiếm theo tên
- `status` (optional): Lọc theo trạng thái (ACTIVE, INACTIVE)
- `campus` (optional): Lọc theo campus ID
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng mỗi trang (mặc định: 10)
- `sortBy` (optional): Trường sắp xếp (mặc định: createdAt)
- `sortOrder` (optional): Thứ tự sắp xếp - asc hoặc desc (mặc định: desc)

**Response:**

```json
{
  "message": "Lấy danh sách tòa nhà thành công",
  "buildings": [
    {
      "_id": "string",
      "name": "string",
      "floor": "number",
      "status": "string",
      "campus": {
        "name": "string",
        "address": "string"
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

### Get Building Stats

**Endpoint:** `GET /zone-area/buildings-stats`

**Request:** Không có parameters

**Response:**

```json
{
  "message": "Lấy thống kê tòa nhà thành công",
  "stats": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "newThisMonth": 3
  }
}
```

## Area

### Get All Areas

**Endpoint:** `GET /zone-area/areas`

**Request Query Parameters:**

- `search` (optional): Tìm kiếm theo tên hoặc mô tả
- `status` (optional): Lọc theo trạng thái (ACTIVE, INACTIVE)
- `campus` (optional): Lọc theo campus ID
- `zoneType` (optional): Lọc theo loại zone
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng mỗi trang (mặc định: 10)
- `sortBy` (optional): Trường sắp xếp (mặc định: createdAt)
- `sortOrder` (optional): Thứ tự sắp xếp - asc hoặc desc (mặc định: desc)

**Response:**

```json
{
  "message": "Lấy danh sách khu vực thành công",
  "areas": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "status": "string",
      "zoneType": "string",
      "campus": {
        "name": "string",
        "address": "string"
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

### Get Area Stats

**Endpoint:** `GET /zone-area/areas-stats`

**Request:** Không có parameters

**Response:**

```json
{
  "message": "Lấy thống kê khu vực thành công",
  "stats": {
    "total": 30,
    "active": 28,
    "inactive": 2,
    "newThisMonth": 2
  }
}
```
