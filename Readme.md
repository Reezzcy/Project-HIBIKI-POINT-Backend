# Campaign Planner - HIBIKI POINT

Kelompok 8

1. 2210511057 - Nicolas Debrito
2. 2210511077 - Derajat Salim Wibowo
3. 2210511081 - Yusuf Martinus Arief
4. 2210511083 - Muhammad Alif Alfattah Riu
5. 2210511093 - Dini Rahmawati

# HIBIKI POINT

Hibiki Point terinspirasi dari dua kata yang penuh makna: Hibiki (響き) dan Point. Dalam bahasa Jepang, Hibiki berarti "resonansi" atau "dampak", menggambarkan bagaimana sesuatu dapat menciptakan gelombang pengaruh yang luas. Sementara itu, Point merujuk pada "titik" atau "fokus", yang melambangkan ketepatan, tujuan, dan arah. Sebagai aplikasi campaign planner, Hibiki Point hadir untuk membantu Anda merancang strategi kampanye yang tidak hanya terstruktur, tetapi juga mampu menciptakan resonansi yang kuat di tengah audiens. Dengan tools yang mudah digunakan, Anda dapat menetapkan tujuan, menyusun strategi, dan melacak hasil kampanye secara terstruktur. Tujuannya adalah memastikan setiap langkah yang Anda ambil tepat sasaran dan memberikan dampak yang berarti bagi audiens Anda. Hibiki Point akan tersedia sebagai aplikasi mobile yang dapat diakses dengan mudah di perangkat Android dan iOS.

# Frontend

Aplikasi ini dikembangkan menggunakan Dart, bahasa pemrograman yang menjadi dasar dari framework Flutter. Dengan Flutter, Hibiki Point diharapkan bisa menawarkan antarmuka yang responsif, performa yang optimal, serta kemudahan dalam pengembangan untuk kedua platform secara bersamaan. Hal ini memastikan Anda dapat merencanakan dan mengelola kampanye mereka kapan saja dan di mana saja dengan pengalaman yang lancar dan konsisten.

# Backend

Untuk sisi backend, Hibiki Point dibangun menggunakan JavaScript dengan runtime Node.js dan framework Express.js sebagai modul utamanya. Dengan kombinasi ini, diharapkan pengembangan dapat lebih cepat dan skalabel, serta mampu menangani berbagai kebutuhan API dengan efisien. Node.js memungkinkan aplikasi untuk berjalan dengan performa tinggi berkat model event-driven dan non-blocking I/O-nya, sementara Express.js menyederhanakan pembuatan endpoint API dengan routing yang fleksibel dan middleware yang powerful. Selain itu, ekosistem npm (Node Package Manager) yang kaya akan library dan tools memastikan proses pengembangan menjadi lebih produktif.

## Getting Started

Follow the steps below to get the project running locally on your machine.

### 1. Clone the Repository

First, clone this repository to your computer using Git:

```bash
git clone https://github.com/Reezzcy/Project-HIBIKI-POINT-Backend.git
cd Project-HIBIKI-POINT-Backend
```

### 2. Configure Environment Variables

Several services in this project require environment variables. You'll need to copy the example files and populate them with the appropriate values:

```bash
cp .env.example .env # or cp service/.env.example service/.env if located in subdirectories
```

Make sure you repeat this step for every .env.example file present within your project

### Run with Docker Compose

This project uses Docker for service orchestration. Please ensure you have Docker and Docker Compose installed on your system.
Run the following command to build and start all services:

```bash
docker-compose up --build
```

Important: Ensure no ports are currently in use on 3001, 3002, 3003, and 3004 before running docker-compose up. If any of these ports are occupied, services might fail to start. You can check occupied ports using commands like netstat -tuln (Linux) or lsof -iTCP -sTCP:LISTEN (macOS).
