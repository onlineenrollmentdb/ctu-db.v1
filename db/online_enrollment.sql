-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 06:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_enrollment`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_history`
--

CREATE TABLE `academic_history` (
  `history_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_section` varchar(50) NOT NULL,
  `semester` enum('1st','2nd') NOT NULL,
  `academic_year` varchar(9) NOT NULL,
  `grade` decimal(4,2) DEFAULT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_history`
--

INSERT INTO `academic_history` (`history_id`, `student_id`, `subject_section`, `semester`, `academic_year`, `grade`, `status`) VALUES
(1, 8221380, 'CO197', '1st', '2025-2026', 1.00, 'Passed'),
(2, 8221380, 'CO194', '1st', '2025-2026', 1.00, 'Passed'),
(3, 8221380, 'CO195', '1st', '2025-2026', 2.00, 'Passed'),
(4, 8221380, 'CO196', '1st', '2025-2026', 1.00, 'Passed'),
(5, 8221380, 'CO192', '1st', '2025-2026', 3.00, 'Passed'),
(6, 8221380, 'CO191', '1st', '2025-2026', 1.00, 'Passed'),
(7, 8221380, 'CO193', '1st', '2025-2026', 1.00, 'Passed'),
(8, 8221380, 'CO199', '1st', '2025-2026', 2.00, 'Passed'),
(9, 8221380, 'CO198', '1st', '2025-2026', 1.00, 'Passed'),
(10, 8221380, 'C039', '2nd', '2025-2026', 1.00, 'Passed'),
(11, 8221380, 'C036', '2nd', '2025-2026', 2.00, 'Passed'),
(12, 8221380, 'C037', '2nd', '2025-2026', 1.00, 'Passed'),
(13, 8221380, 'C032', '2nd', '2025-2026', 2.00, 'Passed'),
(14, 8221380, 'C033', '2nd', '2025-2026', 3.00, 'Passed'),
(15, 8221380, 'C034', '2nd', '2025-2026', 3.00, 'Passed'),
(16, 8221380, 'C035', '2nd', '2025-2026', 1.00, 'Passed'),
(17, 8221380, 'C041', '2nd', '2025-2026', 1.00, 'Passed'),
(18, 8221380, 'C040', '2nd', '2025-2026', 4.00, 'Failed'),
(19, 8221380, 'C038', '2nd', '2025-2026', 1.00, 'Passed');

-- --------------------------------------------------------

--
-- Table structure for table `academic_year_standing`
--

CREATE TABLE `academic_year_standing` (
  `id` int(11) NOT NULL,
  `year_level` tinyint(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `min_credits` int(11) NOT NULL,
  `max_credits` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_year_standing`
--

INSERT INTO `academic_year_standing` (`id`, `year_level`, `name`, `min_credits`, `max_credits`) VALUES
(1, 1, 'Freshman', 0, 53),
(2, 2, 'Sophomore', 52, 96),
(3, 3, 'Junior', 96, 139),
(4, 4, 'Senior', 139, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_user` varchar(100) NOT NULL,
  `admin_pass` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `is_2fa_enabled` tinyint(1) DEFAULT 1,
  `two_fa_code` varchar(10) DEFAULT NULL,
  `two_fa_expires` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_user`, `admin_pass`, `email`, `is_2fa_enabled`, `two_fa_code`, `two_fa_expires`, `created_at`) VALUES
(1, 'admin', '$2b$10$lyUyszLfMtll1Wd8UYlndOlyPq5gZm7L4dmAM7k5JKMszMK7oO3rW', 'martin.tuico@gmail.com', 1, NULL, NULL, '2025-10-25 12:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `authentication_logs`
--

CREATE TABLE `authentication_logs` (
  `log_id` int(11) NOT NULL,
  `user_type` enum('student','faculty','admin') NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime NOT NULL,
  `logout_time` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_code` varchar(10) NOT NULL,
  `department_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_code`, `department_name`) VALUES
(1, 'COTE', 'College of Technology Engineering'),
(2, 'COED', 'College of Education Department');

-- --------------------------------------------------------

--
-- Table structure for table `educational_background`
--

CREATE TABLE `educational_background` (
  `edu_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `level` enum('Basic Education','Higher Education - Bacc','Higher Education - Pg') NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `honors_received` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrollment_status` int(11) NOT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `academic_year` varchar(9) NOT NULL,
  `semester` enum('1st','2nd') NOT NULL,
  `total_units` decimal(4,1) DEFAULT 0.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `student_id`, `enrollment_status`, `faculty_id`, `academic_year`, `semester`, `total_units`) VALUES
(2, 8221380, 3, NULL, '2025-2026', '1st', 25.0),
(3, 8220692, 3, NULL, '2025-2026', '1st', 25.0),
(5, 8221380, 0, NULL, '2025-2026', '2nd', 0.0);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_subjects`
--

CREATE TABLE `enrollment_subjects` (
  `enrollment_id` int(11) NOT NULL,
  `subject_section` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment_subjects`
--

INSERT INTO `enrollment_subjects` (`enrollment_id`, `subject_section`) VALUES
(2, 'CO191'),
(2, 'CO192'),
(2, 'CO193'),
(2, 'CO194'),
(2, 'CO195'),
(2, 'CO196'),
(2, 'CO197'),
(2, 'CO198'),
(2, 'CO199'),
(3, 'CO356'),
(3, 'CO357'),
(3, 'CO358'),
(3, 'CO359'),
(3, 'CO360'),
(3, 'CO361'),
(3, 'CO362'),
(3, 'CO363'),
(3, 'CO364');

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `faculty_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `role` enum('dean','advisor','grader') DEFAULT 'grader',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`faculty_id`, `first_name`, `last_name`, `email`, `password`, `department_id`, `designation`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(123123, 'Jhon', 'Doe', 'jhondoe@gmail.com', '$2b$10$qRnfHwSJPYLpz57z8lNBDuC0NA6nHxTB6.W1nc7GdJdXdSyYY17Si', 1, 'NA', 'grader', 1, '2025-11-19 17:15:07', '2025-11-19 17:10:09', '2025-11-21 15:31:42');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_type` enum('student','faculty','admin') NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('general','grade','enrollment','announcement','reminder') DEFAULT 'general',
  `link` varchar(255) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `sender_type` enum('student','faculty','admin') DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `is_seen` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_type`, `user_id`, `title`, `message`, `type`, `link`, `sender_id`, `sender_type`, `is_read`, `is_seen`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'student', 8220692, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 1, '2025-11-26 02:23:05', '2025-11-26 02:29:47'),
(2, 'student', 8220692, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-26 02:23:10', '2025-11-26 09:40:30');

-- --------------------------------------------------------

--
-- Table structure for table `prerequisites`
--

CREATE TABLE `prerequisites` (
  `prerequisite_id` int(11) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `prereq_subject_code` varchar(20) DEFAULT NULL,
  `year_standing_level` tinyint(4) DEFAULT NULL,
  `type` enum('Pre','Co') NOT NULL DEFAULT 'Pre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prerequisites`
--

INSERT INTO `prerequisites` (`prerequisite_id`, `subject_code`, `prereq_subject_code`, `year_standing_level`, `type`) VALUES
(2, 'CC 123', 'CC 112', NULL, 'Pre'),
(3, 'CC 123', 'CC 112L', NULL, 'Pre'),
(4, 'CC 123L', 'CC 112', NULL, 'Pre'),
(5, 'CC 123L', 'CC 112L', NULL, 'Pre'),
(6, 'AP 2', 'CC 111', NULL, 'Pre'),
(7, 'NSTP 2', 'NSTP 1', NULL, 'Pre'),
(9, 'PC 212', 'PC 121', NULL, 'Pre'),
(10, 'CC 214', 'CC 123', NULL, 'Pre'),
(11, 'CC 214', 'CC 123L', NULL, 'Pre'),
(12, 'CC 214L', 'CC 123', NULL, 'Pre'),
(13, 'CC 214L', 'CC 123L', NULL, 'Pre'),
(14, 'P Elec 1', 'CC 123', NULL, 'Pre'),
(15, 'P Elec 1', 'CC 123L', NULL, 'Pre'),
(16, 'P Elec 1', 'AP 1', NULL, 'Pre'),
(17, 'P Elec 2', 'CC 123', NULL, 'Pre'),
(18, 'P Elec 2', 'CC 123L', NULL, 'Pre'),
(19, 'P Elec 2', 'AP 1', NULL, 'Pre'),
(20, 'PC 223', 'CC 123', NULL, 'Pre'),
(21, 'PC 223', 'CC 123L', NULL, 'Pre'),
(22, 'PC 224', 'AP 2', NULL, 'Pre'),
(23, 'CC 225', 'CC 214', NULL, 'Pre'),
(24, 'CC 225', 'CC 214L', NULL, 'Pre'),
(25, 'CC 225L', 'CC 214', NULL, 'Pre'),
(26, 'CC 225L', 'CC 214L', NULL, 'Pre'),
(27, 'AP 3', 'CC 123', NULL, 'Pre'),
(28, 'AP 3', 'CC 123L', NULL, 'Pre'),
(29, 'PC 315', 'PC 224', NULL, 'Pre'),
(30, 'PC 315L', 'PC 224', NULL, 'Pre'),
(31, 'PC 316', 'PC 223', NULL, 'Pre'),
(32, 'PC 317', 'AP 1', NULL, 'Pre'),
(33, 'PC 317', 'CC 225', NULL, 'Pre'),
(34, 'PC 317', 'CC 225L', NULL, 'Pre'),
(35, 'PC 3180', 'CC 225', NULL, 'Pre'),
(36, 'PC 3180', 'CC 225L', NULL, 'Pre'),
(37, 'CC 316', 'CC 214', NULL, 'Pre'),
(38, 'CC 316', 'CC 214L', NULL, 'Pre'),
(39, 'PC 3211', 'PC 315', NULL, 'Pre'),
(40, 'PC 3211', 'PC 315L', NULL, 'Pre'),
(41, 'PC 3211L', 'PC 315', NULL, 'Pre'),
(42, 'PC 3211L', 'PC 315L', NULL, 'Pre'),
(43, 'AP 5', 'PC 223', NULL, 'Pre'),
(44, 'AP 4', 'CC 316', NULL, 'Pre'),
(45, 'PC 4112L', 'PC 3211', NULL, 'Pre'),
(46, 'PC 4112L', 'PC 3211L', NULL, 'Pre'),
(47, 'PC 4112', 'PC 3211', NULL, 'Pre'),
(48, 'PC 4112', 'PC 3211L', NULL, 'Pre'),
(49, 'PC 4113', 'PC 3211', NULL, 'Pre'),
(50, 'PC 4113', 'PC 3211L', NULL, 'Pre'),
(51, 'PC 4114', 'PC 329', NULL, 'Pre'),
(52, 'P Elec 4', 'PC 316', NULL, 'Pre'),
(53, 'AP 6', 'CC 316', NULL, 'Pre'),
(54, 'AP 6', 'PC 3211', NULL, 'Pre'),
(55, 'AP 6', 'PC 3211L', NULL, 'Pre'),
(60, 'P Elec 3', NULL, 2, 'Pre'),
(61, 'PC 329', NULL, 3, 'Pre'),
(62, 'PC 4215', NULL, 4, 'Pre');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `program_id` int(11) NOT NULL,
  `program_code` varchar(10) NOT NULL,
  `program_name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`program_id`, `program_code`, `program_name`, `department_id`) VALUES
(1, 'BSIT', 'Bachelor of Science in Information Technology', 1),
(2, 'BSEd', 'Bachelor of Secondary Education', 2);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) DEFAULT NULL,
  `academic_year` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_id` int(11) NOT NULL,
  `first_sem_enrollment_start` date NOT NULL,
  `first_sem_enrollment_end` date NOT NULL,
  `first_sem_start` date NOT NULL,
  `first_sem_end` date NOT NULL,
  `second_sem_enrollment_start` date NOT NULL,
  `second_sem_enrollment_end` date NOT NULL,
  `second_sem_start` date NOT NULL,
  `second_sem_end` date NOT NULL,
  `summer_start` date NOT NULL,
  `summer_end` date NOT NULL,
  `current_academic_year` varchar(10) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_id`, `first_sem_enrollment_start`, `first_sem_enrollment_end`, `first_sem_start`, `first_sem_end`, `second_sem_enrollment_start`, `second_sem_enrollment_end`, `second_sem_start`, `second_sem_end`, `summer_start`, `summer_end`, `current_academic_year`, `updated_at`) VALUES
(1, '2025-07-04', '2025-07-17', '2025-07-19', '2025-12-31', '2026-01-04', '2026-01-11', '2026-01-12', '2026-04-29', '2026-05-19', '2026-07-02', '2025-2026', '2025-11-26 22:13:54');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `congressional_district` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `birthplace` varchar(255) DEFAULT NULL,
  `citizenship` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widow/er','Other') DEFAULT 'Single',
  `father_name` varchar(150) DEFAULT NULL,
  `father_occupation` varchar(150) DEFAULT NULL,
  `father_contact` varchar(20) DEFAULT NULL,
  `mother_name` varchar(150) DEFAULT NULL,
  `mother_occupation` varchar(150) DEFAULT NULL,
  `mother_contact` varchar(20) DEFAULT NULL,
  `guardian_name` varchar(150) DEFAULT NULL,
  `guardian_relationship` varchar(100) DEFAULT NULL,
  `guardian_contact` varchar(20) DEFAULT NULL,
  `guardian_email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `program_id` int(11) NOT NULL,
  `year_level` int(11) NOT NULL,
  `section` varchar(50) DEFAULT NULL,
  `student_status` enum('Regular','Irregular') NOT NULL DEFAULT 'Regular',
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_enrolled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `first_name`, `middle_name`, `last_name`, `email`, `contact_number`, `profile_picture`, `permanent_address`, `congressional_district`, `region`, `gender`, `birth_date`, `birthplace`, `citizenship`, `religion`, `civil_status`, `father_name`, `father_occupation`, `father_contact`, `mother_name`, `mother_occupation`, `mother_contact`, `guardian_name`, `guardian_relationship`, `guardian_contact`, `guardian_email`, `password`, `program_id`, `year_level`, `section`, `student_status`, `is_approved`, `is_enrolled`) VALUES
(800000, 'Jhon', 'a', 'Doe', 'jhon@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 2, 1, NULL, 'Regular', 0, 0),
(8210885, 'Emmanuel Philip', 'D', 'Godin', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8212987, 'Alvin', 'M', 'Bantilan', NULL, NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8220692, 'Chariss', 'G', 'Lumongsod', 'charisslumongsod@gmail.com', '091231232342', '/uploads/profile_pictures/1763838140985-316505911.jpg', 'Sala Maya Daanbantayan, Cebu', 'IV', 'VII', 'Female', '2003-12-24', 'Daanbantayan, Cebu', 'Filipino', 'BNINBB', 'Single', 'Roberto Lumongsod', 'N/A', NULL, 'Cherina Lumongsod', 'None', NULL, NULL, NULL, NULL, NULL, '$2b$10$6m5e8rExLwzS4OLiolSZF.4j5YR3Q2MiD.1s/D0F.RTK7m9TicGSG', 1, 2, 'A', 'Regular', 1, 0),
(8220791, 'Angel', 'E', 'Malinao', NULL, NULL, NULL, 'Flores Mabago, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8220799, 'Adriane', 'V', 'Almaden', NULL, NULL, NULL, 'Bateria Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8220802, 'Daphne Yvonne', 'V', 'Mondejar', NULL, NULL, NULL, 'Riverside Maya, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220812, 'Cassey', 'O', 'Gulfan', NULL, NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8220818, 'Manolito Rey Jr.', 'O', 'Quimada', NULL, NULL, NULL, 'Somimbang Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220826, 'Roland', 'L', 'Abellanosa', NULL, NULL, NULL, 'M Cabangcalan Dakit Bogo City Cebu', 'IV', 'VII', 'Male', NULL, 'Bogo City, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8220838, 'Mavene', 'F', 'Dinoy', NULL, NULL, NULL, 'Tindog, Medellin, Cebu', 'IV', 'VII', 'Female', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8220841, 'Niña Pamela', 'P', 'Tibay', NULL, NULL, NULL, 'Langub Sta. Fe Cebu', 'IV', 'VII', 'Female', NULL, 'Sta. Fe, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8220849, 'Chris', 'S', 'Bacunador', NULL, NULL, NULL, 'Lib-og 2 Lanao, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8220860, 'John Lloyd', 'C', 'Dela Rama', NULL, NULL, NULL, 'Don Virgilio Gonzales Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8220865, 'Christian', 'A', 'Calderon', NULL, NULL, NULL, 'Bagay, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8220890, 'Keith Arleanne', 'D', 'Pasaol', NULL, NULL, NULL, 'Purok Rosal 6 Gairan, Bogo City, Cebu', 'IV', 'VII', 'Female', NULL, 'Bogo City, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220905, 'Mark Cleo', 'J', 'Calbang', NULL, NULL, NULL, 'Luy-a, Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8220915, 'Zynah Claire', 'C', 'Umpad', NULL, NULL, NULL, 'Uma, Tindog, Medellin, Cebu', 'IV', 'VII', 'Female', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8220932, 'Janna Krista Kim', 'R', 'Coyoca', NULL, NULL, NULL, 'Poblacion, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8220933, 'Kaye', 'Y', 'Diaz', NULL, NULL, NULL, 'Suba, Malbago, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8221154, 'Angelie', 'S', 'Arranguez', NULL, NULL, NULL, 'Paypay Daanbantayan Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221196, 'Christopher', 'M', 'Aluba', NULL, NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8221204, 'Karl', 'A', 'Noynay', NULL, NULL, NULL, 'Antipolo Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221224, 'Dyna Rose', 'P', 'Aragon', NULL, NULL, NULL, 'Aluba, Bitoon Daanbantayan Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8221231, 'Hannah Israela', 'D', 'Godin', NULL, NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8221297, 'Renz', 'C', 'Lanza', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8221310, 'Clarence', 'T', 'Simoran', NULL, NULL, NULL, 'Sitio Paril, Lamintak Sur', 'IV', 'VII', 'Male', NULL, 'Lamintak Sur', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221327, 'Christian Joy', 'D', 'Bugtong', NULL, NULL, NULL, 'Cabatuan, Tominjao, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221334, 'Rolando Jr.', 'R', 'Lima', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221342, 'Ravenson', 'A', 'Tayong', NULL, NULL, NULL, 'Poblacion Daanbantayan Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221348, 'Bennie', 'A', 'Pinote', NULL, NULL, NULL, 'Tawagan, Poblacion, Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221352, 'Mary Mechille', 'L', 'Doble', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Female', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8221359, 'Goldenmay', 'E', 'Sarol', NULL, NULL, NULL, 'Hagdan, Santa Fe, Cebu', 'IV', 'VII', 'Female', NULL, 'Santa Fe, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8221380, 'Martin Luther', 'Valiente', 'Tuico', 'martin.tuico@gmail.com', '09123123123', '/uploads/profile_pictures/1763750330612-24062189.jpg', 'Calape Daanbantayan Cebu', 'IV', 'VII', 'Male', '2003-09-22', 'Cebu City', 'Filipino', 'Catholic', 'Single', 'Romeo M. Tuico Jr.', 'N/A', NULL, 'Flordeliza V. Tuico', 'N/A', NULL, NULL, NULL, NULL, NULL, '$2b$10$u0ZLx5fo6hbQLdHETk9x.OIaBMTWOv0vWfipZBlVc13E1le6mj5Nu', 1, 1, 'A', 'Irregular', 1, 0),
(8221381, 'Syrus', 'D', 'Tuico', NULL, NULL, NULL, 'Bateria, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8221459, 'Dember', 'M', 'Pepito', NULL, NULL, NULL, 'Maya, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_section` varchar(20) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `subject_desc` text DEFAULT NULL,
  `units` decimal(3,1) NOT NULL DEFAULT 0.0,
  `lec_hours` int(11) NOT NULL DEFAULT 0,
  `lab_hours` int(11) NOT NULL DEFAULT 0,
  `year_level` int(11) NOT NULL CHECK (`year_level` between 1 and 4),
  `semester` enum('1st','2nd','Summer') NOT NULL,
  `program_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_section`, `subject_code`, `subject_desc`, `units`, `lec_hours`, `lab_hours`, `year_level`, `semester`, `program_id`, `created_at`, `updated_at`) VALUES
(1, 'CO191', 'GEC-RPH', 'READINGS IN PHILIPPINE HISTORY', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(2, 'CO192', 'GEC-MMW', 'MATHEMATICS IN THE MODERN WORLD', 3.0, 3, 0, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(3, 'CO193', 'GEE-TEM', 'THE ENTREPRENEURIAL MIND', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(4, 'CO194', 'CC 111', 'INTRODUCTION TO COMPUTING', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 14:53:49'),
(5, 'CO195', 'CC 112', 'COMPUTER PROGRAMMING 1 (LEC)', 2.0, 2, 0, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(6, 'CO196', 'CC 112L', 'COMPUTER PROGRAMMING 1 (LAB)', 3.0, 0, 3, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(7, 'CO197', 'AP 1', 'MULTIMEDIA', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(8, 'CO198', 'PE 1', 'PHYSICAL EDUCATION', 2.0, 2, 0, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(9, 'CO199', 'NSTP 1', 'NATIONAL SERVICE TRAINING PROGRAM', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(10, 'C032', 'GEC-PC', 'PURPOSIVE COMMUNICATION', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(11, 'C033', 'GEC-STS', 'SCIENCE, TECHNOLOGY AND SOCIETY', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(12, 'C034', 'GEC-US', 'UNDERSTANDING THE SELF', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(13, 'C035', 'GEE-GSPS', 'GENDER AND SOCIETY WITH PEACE STUDIES', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(14, 'C036', 'CC 123', 'COMPUTER PROGRAMMING 2 (LEC)', 2.0, 2, 0, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 15:04:11'),
(15, 'C037', 'CC 123L', 'COMPUTER PROGRAMMING 2 (LAB)', 3.0, 0, 3, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 15:07:06'),
(16, 'C038', 'PC 121', 'DISCRETE MATHEMATICS', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 15:09:56'),
(17, 'C039', 'AP 2', 'DIGITAL LOGIC DESIGN', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 15:07:31'),
(18, 'C040', 'PATHFIT 2', 'PHYSICAL ACTIVITIES TOWARDS HEALTH AND', 2.0, 2, 0, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(19, 'C041', 'NSTP 2', 'NATIONAL SERVICE TRAINING PROGRAM 2', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 15:07:42'),
(20, 'CO356', 'GEC-E', 'ETHICS', 3.0, 3, 0, 2, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(21, 'CO357', 'GEE-ES', 'ENVIRONMENTAL SCIENCE', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(22, 'CO358', 'GEC-LWR', 'LIFE AND WORKS OF RIZAL', 3.0, 3, 0, 2, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(23, 'CO359', 'PC 212', 'QUANTITATIVE METHODS (MODELING & SIMULATION)', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 15:10:45'),
(24, 'CO360', 'CC 214', 'DATA STRUCTURES AND ALGORITHMS (LEC)', 2.0, 2, 0, 2, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 15:10:54'),
(25, 'CO361', 'CC 214L', 'DATA STRUCTURES AND ALGORITHMS (LAB)', 3.0, 0, 3, 2, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 15:11:00'),
(26, 'CO362', 'P Elec 1', 'OBJECT ORIENTED PROGRAMMING', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 15:11:13'),
(27, 'CO363', 'P Elec 2', 'WEB SYSTEMS AND TECHNOLOGIES', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 15:11:35'),
(28, 'CO364', 'PE 3', 'PHYSICAL EDUCATION 3', 2.0, 2, 0, 2, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(29, 'C070', 'GEC-TCW', 'THE CONTEMPORARY WORLD', 3.0, 3, 0, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(30, 'C071', 'PC 223', 'INTEGRATIVE PROGRAMMING AND TECHNOLOGIES 1', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:05:07'),
(31, 'C072', 'PC 224', 'NETWORKING 1', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:05:15'),
(32, 'C073', 'CC 225', 'INFORMATION MANAGEMENT (LEC)', 2.0, 2, 0, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:05:32'),
(33, 'C074', 'CC 225L', 'INFORMATION MANAGEMENT (LAB)', 3.0, 0, 3, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:05:50'),
(34, 'C075', 'P Elec 3', 'PLATFORM TECHNOLOGIES', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 19:20:54'),
(35, 'C076', 'AP 3', 'ASP.NET', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:06:05'),
(36, 'C077', 'PATHFIT4', 'PHYSICAL ACTIVITIES TOWARDS HEALTH AND', 2.0, 2, 0, 2, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(37, 'CO152', 'GEE-FE', 'FUNCTIONAL ENGLISH', 3.0, 3, 0, 3, '1st', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(38, 'CO153', 'PC 315', 'NETWORKING 2 (LEC)', 2.0, 2, 0, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:07:13'),
(39, 'CO154', 'PC 315L', 'NETWORKING 2 (LAB)', 3.0, 0, 3, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:07:22'),
(40, 'CO155', 'PC 316', 'SYSTEMS INTEGRATION AND ARCHITECTURE 1', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:07:30'),
(41, 'CO156', 'PC 317', 'INTRODUCTION TO HUMAN COMPUTER INTERACTION', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:07:44'),
(42, 'CO157', 'PC 3180', 'DATABASE MANAGEMENT SYSTEMS', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:08:03'),
(43, 'CO158', 'CC 316', 'APPLICATIONS DEVELOPMENT AND EMERGING TECHNOLOGIES', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 12:59:01', '2025-11-26 16:08:22'),
(44, 'C078', 'GEC-AA', 'ART APPRECIATION', 3.0, 3, 0, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(45, 'C079', 'GEE-PEE', "PEOPLE AND THE EARTH\'S ECOSYSTEMS", 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(46, 'C080', 'PC 329', 'CAPSTONE PROJECT AND RESEARCH 1', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 19:21:25'),
(47, 'C081', 'PC 3210', 'SOCIAL AND PROFESSIONAL ISSUES', 3.0, 3, 0, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-10-25 12:59:01'),
(48, 'C082', 'PC 3211', 'INFORMATION ASSURANCE AND SECURITY 1 (LEC)', 2.0, 2, 0, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:08:42'),
(49, 'C083', 'PC 3211L', 'INFORMATION ASSURANCE AND SECURITY 1 (LAB)', 3.0, 0, 3, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:08:57'),
(50, 'COB4', 'AP 4', 'IOS MOBILE APPLICATION DEVELOPMENT', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:09:14'),
(51, 'C085', 'AP 5', 'TECHNOLOGY AND THE APPLICATION OF THE', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 16:09:04'),
(52, 'CO159', 'PC 4112', 'INFORMATION ASSURANCE AND SECURITY 2 (LEC)', 2.0, 2, 0, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:31:32'),
(53, 'CO160', 'PC 4112L', 'INFORMATION ASSURANCE AND SECURITY 2 (LAB)', 3.0, 0, 9, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:31:17'),
(54, 'CO161', 'PC 4113', 'SYSTEMS ADMINISTRATION AND MAINTENANCE', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:31:42'),
(55, 'CO162', 'PC 4114', 'CAPSTONE PROJECT AND RESEARCH 3', 3.0, 3, 0, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:31:52'),
(56, 'CO163', 'P Elec 4', 'SYSTE INFORMATION AND ARCHITECTURE 2', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:32:02'),
(57, 'CO164', 'AP 6', 'CROSS-PLATFORM SCRIPT DEVELOPMENT TECHNOLOGY', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 16:18:02', '2025-11-26 16:32:17'),
(58, 'C0110', 'PC 4215', 'ON-THE-JOB-TRAINING (OJT)', 9.0, 0, 0, 4, '2nd', 1, '2025-10-25 12:59:01', '2025-11-26 19:21:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_history`
--
ALTER TABLE `academic_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_section` (`subject_section`);

--
-- Indexes for table `academic_year_standing`
--
ALTER TABLE `academic_year_standing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_user` (`admin_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `authentication_logs`
--
ALTER TABLE `authentication_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_code` (`department_code`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `educational_background`
--
ALTER TABLE `educational_background`
  ADD PRIMARY KEY (`edu_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `enrollment_subjects`
--
ALTER TABLE `enrollment_subjects`
  ADD PRIMARY KEY (`enrollment_id`,`subject_section`),
  ADD KEY `subject_section` (`subject_section`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`faculty_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user` (`user_type`,`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `prerequisites`
--
ALTER TABLE `prerequisites`
  ADD PRIMARY KEY (`prerequisite_id`),
  ADD UNIQUE KEY `uq_subject_prereq` (`subject_code`,`prereq_subject_code`,`type`),
  ADD KEY `prereq_subject_code` (`prereq_subject_code`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`program_id`),
  ADD UNIQUE KEY `program_code` (`program_code`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `subject_code` (`subject_code`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `contact_number` (`contact_number`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_section` (`subject_section`),
  ADD UNIQUE KEY `subject_code` (`subject_code`),
  ADD KEY `program_id` (`program_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_history`
--
ALTER TABLE `academic_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `academic_year_standing`
--
ALTER TABLE `academic_year_standing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `authentication_logs`
--
ALTER TABLE `authentication_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `educational_background`
--
ALTER TABLE `educational_background`
  MODIFY `edu_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123124;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prerequisites`
--
ALTER TABLE `prerequisites`
  MODIFY `prerequisite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academic_history`
--
ALTER TABLE `academic_history`
  ADD CONSTRAINT `academic_history_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `academic_history_ibfk_2` FOREIGN KEY (`subject_section`) REFERENCES `subjects` (`subject_section`) ON DELETE CASCADE;

--
-- Constraints for table `educational_background`
--
ALTER TABLE `educational_background`
  ADD CONSTRAINT `educational_background_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL;

--
-- Constraints for table `enrollment_subjects`
--
ALTER TABLE `enrollment_subjects`
  ADD CONSTRAINT `enrollment_subjects_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollment_subjects_ibfk_2` FOREIGN KEY (`subject_section`) REFERENCES `subjects` (`subject_section`) ON DELETE CASCADE;

--
-- Constraints for table `faculties`
--
ALTER TABLE `faculties`
  ADD CONSTRAINT `faculties_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL;

--
-- Constraints for table `prerequisites`
--
ALTER TABLE `prerequisites`
  ADD CONSTRAINT `prerequisites_ibfk_1` FOREIGN KEY (`subject_code`) REFERENCES `subjects` (`subject_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `prerequisites_ibfk_2` FOREIGN KEY (`prereq_subject_code`) REFERENCES `subjects` (`subject_code`) ON DELETE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`subject_code`) REFERENCES `subjects` (`subject_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
