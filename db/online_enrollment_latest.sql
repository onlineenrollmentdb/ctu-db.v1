-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2026 at 05:41 PM
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
  `subject_section` varchar(255) DEFAULT NULL,
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
(10, 8221380, 'C039', '2nd', '2025-2026', 3.20, 'Failed'),
(11, 8221380, 'C036', '2nd', '2025-2026', 2.00, 'Passed'),
(12, 8221380, 'C037', '2nd', '2025-2026', 1.00, 'Passed'),
(13, 8221380, 'C032', '2nd', '2025-2026', 2.00, 'Passed'),
(14, 8221380, 'C033', '2nd', '2025-2026', 3.00, 'Passed'),
(15, 8221380, 'C034', '2nd', '2025-2026', 3.00, 'Passed'),
(16, 8221380, 'C035', '2nd', '2025-2026', 1.00, 'Passed'),
(17, 8221380, 'C041', '2nd', '2025-2026', 1.00, 'Passed'),
(18, 8221380, 'C040', '2nd', '2025-2026', 2.00, 'Passed'),
(19, 8221380, 'C038', '2nd', '2025-2026', 1.00, 'Passed'),
(39, 821020, 'CO197', '1st', '2025-2026', 1.00, 'Passed'),
(40, 821020, 'CO194', '1st', '2025-2026', 1.00, 'Passed'),
(41, 821020, 'CO195', '1st', '2025-2026', 2.00, 'Passed'),
(42, 821020, 'CO196', '1st', '2025-2026', 1.50, 'Passed'),
(43, 821020, 'CO192', '1st', '2025-2026', 2.00, 'Passed'),
(44, 821020, 'CO191', '1st', '2025-2026', 2.00, 'Passed'),
(45, 821020, 'CO193', '1st', '2025-2026', 2.00, 'Passed'),
(46, 821020, 'CO199', '1st', '2025-2026', 3.00, 'Passed'),
(47, 821020, 'CO198', '1st', '2025-2026', 2.00, 'Passed'),
(48, 821020, 'C039', '2nd', '2025-2026', 3.00, 'Passed'),
(49, 821020, 'C036', '2nd', '2025-2026', 2.00, 'Passed'),
(50, 821020, 'C037', '2nd', '2025-2026', 2.00, 'Passed'),
(51, 821020, 'C032', '2nd', '2025-2026', 2.00, 'Passed'),
(52, 821020, 'C033', '2nd', '2025-2026', 1.20, 'Passed'),
(53, 821020, 'C034', '2nd', '2025-2026', 2.00, 'Passed'),
(54, 821020, 'C035', '2nd', '2025-2026', 1.00, 'Passed'),
(55, 821020, 'C041', '2nd', '2025-2026', 2.00, 'Passed'),
(56, 821020, 'C040', '2nd', '2025-2026', 2.10, 'Passed'),
(57, 821020, 'C038', '2nd', '2025-2026', 2.00, 'Passed'),
(58, 821020, 'CO360', '1st', '2025-2026', 3.50, 'Failed'),
(59, 821020, 'CO361', '1st', '2025-2026', 3.40, 'Failed'),
(60, 821020, 'CO356', '1st', '2025-2026', 2.00, 'Passed'),
(61, 821020, 'CO358', '1st', '2025-2026', 3.00, 'Passed'),
(62, 821020, 'CO357', '1st', '2025-2026', 2.00, 'Passed'),
(63, 821020, 'CO362', '1st', '2025-2026', 3.00, 'Passed'),
(64, 821020, 'CO363', '1st', '2025-2026', 3.00, 'Passed'),
(65, 821020, 'CO359', '1st', '2025-2026', 2.00, 'Passed'),
(66, 821020, 'CO364', '1st', '2025-2026', 2.00, 'Passed'),
(67, 821020, 'C076', '2nd', '2025-2026', 3.00, 'Passed'),
(68, 821020, 'C073', '2nd', '2025-2026', 1.00, 'Passed'),
(69, 821020, 'C074', '2nd', '2025-2026', 1.00, 'Passed'),
(70, 821020, 'C070', '2nd', '2025-2026', 2.00, 'Passed'),
(71, 821020, 'C075', '2nd', '2025-2026', 2.00, 'Passed'),
(72, 821020, 'C077', '2nd', '2025-2026', 2.00, 'Passed'),
(73, 821020, 'C071', '2nd', '2025-2026', 1.00, 'Passed'),
(74, 821020, 'C072', '2nd', '2025-2026', 2.00, 'Passed'),
(75, 8221248, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(76, 8221248, 'CO194', '1st', '2025-2026', 2.00, 'Passed'),
(77, 8221248, 'CO195', '1st', '2025-2026', 1.00, 'Passed'),
(78, 8221248, 'CO196', '1st', '2025-2026', 2.00, 'Passed'),
(79, 8221248, 'CO192', '1st', '2025-2026', 1.00, 'Passed'),
(80, 8221248, 'CO191', '1st', '2025-2026', 2.00, 'Passed'),
(81, 8221248, 'CO193', '1st', '2025-2026', 2.00, 'Passed'),
(82, 8221248, 'CO199', '1st', '2025-2026', 1.00, 'Passed'),
(83, 8221248, 'CO198', '1st', '2025-2026', 2.00, 'Passed'),
(84, 8221248, 'C039', '2nd', '2025-2026', 2.00, 'Passed'),
(85, 8221248, 'C036', '2nd', '2025-2026', 2.00, 'Passed'),
(86, 8221248, 'C037', '2nd', '2025-2026', 2.00, 'Passed'),
(87, 8221248, 'C032', '2nd', '2025-2026', 1.00, 'Passed'),
(88, 8221248, 'C033', '2nd', '2025-2026', 2.00, 'Passed'),
(89, 8221248, 'C034', '2nd', '2025-2026', 2.00, 'Passed'),
(90, 8221248, 'C035', '2nd', '2025-2026', 2.00, 'Passed'),
(91, 8221248, 'C041', '2nd', '2025-2026', 2.00, 'Passed'),
(92, 8221248, 'C040', '2nd', '2025-2026', 2.00, 'Passed'),
(93, 8221248, 'C038', '2nd', '2025-2026', 2.00, 'Passed'),
(94, 8221248, 'CO360', '1st', '2025-2026', 3.40, 'Failed'),
(95, 8221248, 'CO361', '1st', '2025-2026', 3.50, 'Failed'),
(96, 8221248, 'CO356', '1st', '2025-2026', 2.00, 'Passed'),
(97, 8221248, 'CO358', '1st', '2025-2026', 2.00, 'Passed'),
(98, 8221248, 'CO357', '1st', '2025-2026', 1.00, 'Passed'),
(99, 8221248, 'CO362', '1st', '2025-2026', 2.00, 'Passed'),
(100, 8221248, 'CO363', '1st', '2025-2026', 3.00, 'Passed'),
(101, 8221248, 'CO359', '1st', '2025-2026', 3.00, 'Passed'),
(102, 8221248, 'CO364', '1st', '2025-2026', 2.00, 'Passed'),
(103, 8221248, 'C076', '2nd', '2025-2026', 3.00, 'Passed'),
(104, 8221248, 'C073', '2nd', '2025-2026', 3.00, 'Passed'),
(105, 8221248, 'C074', '2nd', '2025-2026', 2.00, 'Passed'),
(106, 8221248, 'C070', '2nd', '2025-2026', 2.00, 'Passed'),
(107, 8221248, 'C075', '2nd', '2025-2026', 3.00, 'Passed'),
(108, 8221248, 'C077', '2nd', '2025-2026', 2.00, 'Passed'),
(109, 8221248, 'C071', '2nd', '2025-2026', 3.00, 'Passed'),
(110, 8221248, 'C072', '2nd', '2025-2026', 2.00, 'Passed'),
(111, 8221024, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(112, 8221024, 'CO194', '1st', '2025-2026', 2.00, 'Passed'),
(113, 8221024, 'CO195', '1st', '2025-2026', 1.00, 'Passed'),
(114, 8221024, 'CO196', '1st', '2025-2026', 2.00, 'Passed'),
(115, 8221024, 'CO192', '1st', '2025-2026', 2.00, 'Passed'),
(116, 8221024, 'CO191', '1st', '2025-2026', 1.00, 'Passed'),
(117, 8221024, 'CO193', '1st', '2025-2026', 2.00, 'Passed'),
(118, 8221024, 'CO199', '1st', '2025-2026', 3.00, 'Passed'),
(119, 8221024, 'CO198', '1st', '2025-2026', 3.00, 'Passed'),
(120, 8221024, 'C039', '2nd', '2025-2026', 2.00, 'Passed'),
(121, 8221024, 'C036', '2nd', '2025-2026', 3.00, 'Passed'),
(122, 8221024, 'C037', '2nd', '2025-2026', 2.00, 'Passed'),
(123, 8221024, 'C032', '2nd', '2025-2026', 3.00, 'Passed'),
(124, 8221024, 'C033', '2nd', '2025-2026', 2.00, 'Passed'),
(125, 8221024, 'C034', '2nd', '2025-2026', 3.00, 'Passed'),
(126, 8221024, 'C035', '2nd', '2025-2026', 3.00, 'Passed'),
(127, 8221024, 'C041', '2nd', '2025-2026', 2.00, 'Passed'),
(128, 8221024, 'C040', '2nd', '2025-2026', 2.00, 'Passed'),
(129, 8221024, 'C038', '2nd', '2025-2026', 1.00, 'Passed'),
(130, 8221024, 'CO360', '1st', '2025-2026', 3.60, 'Failed'),
(131, 8221024, 'CO361', '1st', '2025-2026', 3.40, 'Failed'),
(132, 8221024, 'CO356', '1st', '2025-2026', 2.00, 'Passed'),
(133, 8221024, 'CO358', '1st', '2025-2026', 3.00, 'Passed'),
(134, 8221024, 'CO357', '1st', '2025-2026', 2.00, 'Passed'),
(135, 8221024, 'CO362', '1st', '2025-2026', 2.00, 'Passed'),
(136, 8221024, 'CO363', '1st', '2025-2026', 1.00, 'Passed'),
(137, 8221024, 'CO359', '1st', '2025-2026', 2.00, 'Passed'),
(138, 8221024, 'CO364', '1st', '2025-2026', 2.00, 'Passed'),
(139, 8221024, 'C076', '2nd', '2025-2026', 3.00, 'Passed'),
(140, 8221024, 'C073', '2nd', '2025-2026', 2.00, 'Passed'),
(141, 8221024, 'C074', '2nd', '2025-2026', 2.00, 'Passed'),
(142, 8221024, 'C070', '2nd', '2025-2026', 2.00, 'Passed'),
(143, 8221024, 'C075', '2nd', '2025-2026', 3.00, 'Passed'),
(144, 8221024, 'C077', '2nd', '2025-2026', 2.00, 'Passed'),
(145, 8221024, 'C071', '2nd', '2025-2026', 2.00, 'Passed'),
(146, 8221024, 'C072', '2nd', '2025-2026', 3.00, 'Passed'),
(147, 8221335, 'CO158', '1st', '2025-2026', 2.00, 'Passed'),
(148, 8221335, 'CO152', '1st', '2025-2026', 2.00, 'Passed'),
(149, 8221335, 'CO153', '1st', '2025-2026', 2.00, 'Passed'),
(150, 8221335, 'CO154', '1st', '2025-2026', 2.00, 'Passed'),
(151, 8221335, 'CO155', '1st', '2025-2026', 2.00, 'Passed'),
(152, 8221335, 'CO156', '1st', '2025-2026', 2.00, 'Passed'),
(153, 8221335, 'CO157', '1st', '2025-2026', 2.00, 'Passed'),
(154, 8221237, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(155, 8221237, 'CO194', '1st', '2025-2026', 1.00, 'Passed'),
(156, 8221237, 'CO195', '1st', '2025-2026', 1.00, 'Passed'),
(157, 8221237, 'CO196', '1st', '2025-2026', 2.00, 'Passed'),
(158, 8221237, 'CO192', '1st', '2025-2026', 2.00, 'Passed'),
(159, 8221237, 'CO191', '1st', '2025-2026', 1.00, 'Passed'),
(160, 8221237, 'CO193', '1st', '2025-2026', 2.00, 'Passed'),
(161, 8221237, 'CO199', '1st', '2025-2026', 2.00, 'Passed'),
(162, 8221237, 'CO198', '1st', '2025-2026', 1.00, 'Passed'),
(163, 8221237, 'C039', '2nd', '2025-2026', 2.00, 'Passed'),
(164, 8221237, 'C036', '2nd', '2025-2026', 1.00, 'Passed'),
(165, 8221237, 'C037', '2nd', '2025-2026', 2.00, 'Passed'),
(166, 8221237, 'C032', '2nd', '2025-2026', 1.00, 'Passed'),
(167, 8221237, 'C033', '2nd', '2025-2026', 1.00, 'Passed'),
(168, 8221237, 'C034', '2nd', '2025-2026', 1.00, 'Passed'),
(169, 8221237, 'C035', '2nd', '2025-2026', 2.00, 'Passed'),
(170, 8221237, 'C041', '2nd', '2025-2026', 1.00, 'Passed'),
(171, 8221237, 'C040', '2nd', '2025-2026', 2.00, 'Passed'),
(172, 8221237, 'C038', '2nd', '2025-2026', 2.00, 'Passed'),
(173, 8221237, 'CO360', '1st', '2025-2026', 1.00, 'Passed'),
(174, 8221237, 'CO361', '1st', '2025-2026', 1.00, 'Passed'),
(175, 8221237, 'CO356', '1st', '2025-2026', 2.00, 'Passed'),
(176, 8221237, 'CO358', '1st', '2025-2026', 1.00, 'Passed'),
(177, 8221237, 'CO357', '1st', '2025-2026', 1.50, 'Passed'),
(178, 8221237, 'CO362', '1st', '2025-2026', 2.00, 'Passed'),
(179, 8221237, 'CO363', '1st', '2025-2026', 2.30, 'Passed'),
(180, 8221237, 'CO359', '1st', '2025-2026', 2.00, 'Passed'),
(181, 8221237, 'CO364', '1st', '2025-2026', 1.00, 'Passed'),
(182, 8221237, 'C076', '2nd', '2025-2026', 1.00, 'Passed'),
(183, 8221237, 'C073', '2nd', '2025-2026', 1.00, 'Passed'),
(184, 8221237, 'C074', '2nd', '2025-2026', 1.00, 'Passed'),
(185, 8221237, 'C070', '2nd', '2025-2026', 2.00, 'Passed'),
(186, 8221237, 'C075', '2nd', '2025-2026', 2.00, 'Passed'),
(187, 8221237, 'C077', '2nd', '2025-2026', 2.00, 'Passed'),
(188, 8221237, 'C071', '2nd', '2025-2026', 3.00, 'Passed'),
(189, 8221237, 'C072', '2nd', '2025-2026', 2.00, 'Passed'),
(190, 8221237, 'CO158', '1st', '2025-2026', 2.00, 'Passed'),
(191, 8221237, 'CO152', '1st', '2025-2026', 2.00, 'Passed'),
(192, 8221237, 'CO153', '1st', '2025-2026', 1.00, 'Passed'),
(193, 8221237, 'CO154', '1st', '2025-2026', 2.00, 'Passed'),
(194, 8221237, 'CO155', '1st', '2025-2026', 2.00, 'Passed'),
(195, 8221237, 'CO156', '1st', '2025-2026', 1.00, 'Passed'),
(196, 8221237, 'CO157', '1st', '2025-2026', 2.00, 'Passed'),
(197, 8221237, 'COB4', '2nd', '2025-2026', 1.00, 'Passed'),
(198, 8221237, 'C085', '2nd', '2025-2026', 2.00, 'Passed'),
(199, 8221237, 'C078', '2nd', '2025-2026', 2.00, 'Passed'),
(200, 8221237, 'C079', '2nd', '2025-2026', 1.00, 'Passed'),
(201, 8221237, 'C081', '2nd', '2025-2026', 2.00, 'Passed'),
(202, 8221237, 'C082', '2nd', '2025-2026', 2.00, 'Passed'),
(203, 8221237, 'C083', '2nd', '2025-2026', 1.00, 'Passed'),
(204, 8221237, 'C080', '2nd', '2025-2026', 1.00, 'Passed'),
(205, 8240376, 'C072', '1st', '2025-2026', 3.00, 'Passed'),
(206, 8240934, 'C072', '1st', '2025-2026', 1.00, 'Passed'),
(207, 8241149, 'C072', '1st', '2025-2026', 2.00, 'Passed'),
(208, 8240831, 'C072', '1st', '2025-2026', 2.00, 'Passed'),
(209, 8251141, 'C074', '2nd', '2025-2026', 1.00, 'Passed'),
(210, 8221335, 'CO197', '1st', '2025-2026', 1.80, 'Passed'),
(211, 8221335, 'CO194', '1st', '2025-2026', 2.10, 'Passed'),
(212, 8221335, 'CO195', '1st', '2025-2026', 1.40, 'Passed'),
(213, 8221335, 'CO196', '1st', '2025-2026', 1.50, 'Passed'),
(214, 8221335, 'CO192', '1st', '2025-2026', 1.80, 'Passed'),
(215, 8221335, 'CO191', '1st', '2025-2026', 1.80, 'Passed'),
(216, 8221335, 'CO193', '1st', '2025-2026', 2.40, 'Passed'),
(217, 8221335, 'CO199', '1st', '2025-2026', 1.90, 'Passed'),
(218, 8221335, 'CO198', '1st', '2025-2026', 1.70, 'Passed'),
(219, 8221335, 'C039', '2nd', '2025-2026', 2.60, 'Passed'),
(220, 8221335, 'C036', '2nd', '2025-2026', 2.60, 'Passed'),
(221, 8221335, 'C037', '2nd', '2025-2026', 2.50, 'Passed'),
(222, 8221335, 'C032', '2nd', '2025-2026', 2.10, 'Passed'),
(223, 8221335, 'C033', '2nd', '2025-2026', 2.00, 'Passed'),
(224, 8221335, 'C034', '2nd', '2025-2026', 2.10, 'Passed'),
(225, 8221335, 'C035', '2nd', '2025-2026', 1.90, 'Passed'),
(226, 8221335, 'C041', '2nd', '2025-2026', 1.50, 'Passed'),
(227, 8221335, 'C040', '2nd', '2025-2026', 1.60, 'Passed'),
(228, 8221335, 'C038', '2nd', '2025-2026', 2.10, 'Passed'),
(229, 8221335, 'CO360', '1st', '2025-2026', 2.50, 'Passed'),
(230, 8221335, 'CO361', '1st', '2025-2026', 2.40, 'Passed'),
(231, 8221335, 'CO356', '1st', '2025-2026', 1.90, 'Passed'),
(232, 8221335, 'CO358', '1st', '2025-2026', 1.70, 'Passed'),
(233, 8221335, 'CO357', '1st', '2025-2026', 2.40, 'Passed'),
(234, 8221335, 'CO362', '1st', '2025-2026', 2.00, 'Passed'),
(235, 8221335, 'CO363', '1st', '2025-2026', 2.10, 'Passed'),
(236, 8221335, 'CO359', '1st', '2025-2026', 2.60, 'Passed'),
(237, 8221335, 'CO364', '1st', '2025-2026', 1.60, 'Passed'),
(238, 8221335, 'C076', '2nd', '2025-2026', 1.50, 'Passed'),
(239, 8221335, 'C073', '2nd', '2025-2026', 2.60, 'Passed'),
(240, 8221335, 'C074', '2nd', '2025-2026', 2.40, 'Passed'),
(241, 8221335, 'C070', '2nd', '2025-2026', 2.30, 'Passed'),
(242, 8221335, 'C077', '2nd', '2025-2026', 2.30, 'Passed'),
(243, 8221335, 'C071', '2nd', '2025-2026', 2.10, 'Passed'),
(244, 8221335, 'C072', '2nd', '2025-2026', 2.30, 'Passed'),
(245, 8221335, 'COB4', '2nd', '2025-2026', 2.50, 'Passed'),
(246, 8221335, 'C085', '2nd', '2025-2026', 2.50, 'Passed'),
(247, 8221335, 'C078', '2nd', '2025-2026', 1.80, 'Passed'),
(248, 8221335, 'C079', '2nd', '2025-2026', 1.80, 'Passed'),
(249, 8221335, 'C081', '2nd', '2025-2026', 2.20, 'Passed'),
(250, 8221335, 'C082', '2nd', '2025-2026', 1.80, 'Passed'),
(251, 8221335, 'C083', '2nd', '2025-2026', 1.80, 'Passed'),
(252, 8221335, 'C080', '2nd', '2025-2026', 1.80, 'Passed'),
(253, 8220826, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(254, 8220826, 'CO194', '1st', '2025-2026', 2.30, 'Passed'),
(255, 8220826, 'CO195', '1st', '2025-2026', 1.50, 'Passed'),
(256, 8220826, 'CO196', '1st', '2025-2026', 1.60, 'Passed'),
(257, 8220826, 'CO192', '1st', '2025-2026', 1.80, 'Passed'),
(258, 8220826, 'CO191', '1st', '2025-2026', 2.10, 'Passed'),
(259, 8220826, 'CO193', '1st', '2025-2026', 1.90, 'Passed'),
(260, 8220826, 'CO199', '1st', '2025-2026', 1.40, 'Passed'),
(261, 8220826, 'CO198', '1st', '2025-2026', 1.70, 'Passed'),
(262, 8220826, 'C039', '2nd', '2025-2026', 2.20, 'Passed'),
(263, 8220826, 'C036', '2nd', '2025-2026', 2.40, 'Passed'),
(264, 8220826, 'C037', '2nd', '2025-2026', 2.50, 'Passed'),
(265, 8220826, 'C032', '2nd', '2025-2026', 2.80, 'Passed'),
(266, 8220826, 'C033', '2nd', '2025-2026', 2.60, 'Passed'),
(267, 8220826, 'C034', '2nd', '2025-2026', 2.10, 'Passed'),
(268, 8220826, 'C035', '2nd', '2025-2026', 1.50, 'Passed'),
(269, 8220826, 'C041', '2nd', '2025-2026', 1.50, 'Passed'),
(270, 8220826, 'C040', '2nd', '2025-2026', 1.60, 'Passed'),
(271, 8220826, 'C038', '2nd', '2025-2026', 1.20, 'Passed'),
(272, 8220826, 'CO360', '1st', '2025-2026', 1.80, 'Passed'),
(273, 8220826, 'CO361', '1st', '2025-2026', 1.90, 'Passed'),
(274, 8220826, 'CO356', '1st', '2025-2026', 1.60, 'Passed'),
(275, 8220826, 'CO358', '1st', '2025-2026', 2.10, 'Passed'),
(276, 8220826, 'CO357', '1st', '2025-2026', 2.00, 'Passed'),
(277, 8220826, 'CO362', '1st', '2025-2026', 2.50, 'Passed'),
(278, 8220826, 'CO363', '1st', '2025-2026', 2.30, 'Passed'),
(279, 8220826, 'CO359', '1st', '2025-2026', 1.20, 'Passed'),
(280, 8220826, 'CO364', '1st', '2025-2026', 1.00, 'Passed'),
(281, 8220826, 'C076', '2nd', '2025-2026', 1.80, 'Passed'),
(282, 8220826, 'C073', '2nd', '2025-2026', 1.70, 'Passed'),
(283, 8220826, 'C074', '2nd', '2025-2026', 1.50, 'Passed'),
(284, 8220826, 'C070', '2nd', '2025-2026', 1.60, 'Passed'),
(285, 8220826, 'C075', '2nd', '2025-2026', 2.10, 'Passed'),
(286, 8220826, 'C077', '2nd', '2025-2026', 2.50, 'Passed'),
(287, 8220826, 'C071', '2nd', '2025-2026', 2.50, 'Passed'),
(288, 8220826, 'C072', '2nd', '2025-2026', 2.50, 'Passed'),
(289, 8220826, 'CO158', '1st', '2025-2026', 2.10, 'Passed'),
(290, 8220826, 'CO152', '1st', '2025-2026', 2.50, 'Passed'),
(291, 8220826, 'CO153', '1st', '2025-2026', 1.00, 'Passed'),
(292, 8220826, 'CO154', '1st', '2025-2026', 1.70, 'Passed'),
(293, 8220826, 'CO155', '1st', '2025-2026', 1.80, 'Passed'),
(294, 8220826, 'CO156', '1st', '2025-2026', 1.30, 'Passed'),
(295, 8220826, 'CO157', '1st', '2025-2026', 1.50, 'Passed'),
(296, 8220826, 'COB4', '2nd', '2025-2026', 1.60, 'Passed'),
(297, 8220826, 'C085', '2nd', '2025-2026', 1.50, 'Passed'),
(298, 8220826, 'C078', '2nd', '2025-2026', 1.70, 'Passed'),
(299, 8220826, 'C079', '2nd', '2025-2026', 1.80, 'Passed'),
(300, 8220826, 'C081', '2nd', '2025-2026', 2.60, 'Passed'),
(301, 8220826, 'C082', '2nd', '2025-2026', 2.30, 'Passed'),
(302, 8220826, 'C083', '2nd', '2025-2026', 2.70, 'Passed'),
(303, 8220826, 'C080', '2nd', '2025-2026', 1.90, 'Passed'),
(304, 8221342, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(305, 8221342, 'CO194', '1st', '2025-2026', 1.80, 'Passed'),
(306, 8221342, 'CO195', '1st', '2025-2026', 1.70, 'Passed'),
(307, 8221342, 'CO196', '1st', '2025-2026', 1.80, 'Passed'),
(308, 8221342, 'CO192', '1st', '2025-2026', 2.20, 'Passed'),
(309, 8221342, 'CO191', '1st', '2025-2026', 2.00, 'Passed'),
(310, 8221342, 'CO193', '1st', '2025-2026', 2.30, 'Passed'),
(311, 8221342, 'CO199', '1st', '2025-2026', 1.90, 'Passed'),
(312, 8221342, 'CO198', '1st', '2025-2026', 1.60, 'Passed'),
(313, 8221342, 'C039', '2nd', '2025-2026', 2.00, 'Passed'),
(314, 8221342, 'C036', '2nd', '2025-2026', 2.20, 'Passed'),
(315, 8221342, 'C037', '2nd', '2025-2026', 2.10, 'Passed'),
(316, 8221342, 'C032', '2nd', '2025-2026', 2.40, 'Passed'),
(317, 8221342, 'C033', '2nd', '2025-2026', 2.20, 'Passed'),
(318, 8221342, 'C034', '2nd', '2025-2026', 1.90, 'Passed'),
(319, 8221342, 'C035', '2nd', '2025-2026', 1.80, 'Passed'),
(320, 8221342, 'C041', '2nd', '2025-2026', 2.00, 'Passed'),
(321, 8221342, 'C040', '2nd', '2025-2026', 1.80, 'Passed'),
(322, 8221342, 'C038', '2nd', '2025-2026', 2.30, 'Passed'),
(323, 8221342, 'CO360', '1st', '2025-2026', 2.20, 'Passed'),
(324, 8221342, 'CO361', '1st', '2025-2026', 2.10, 'Passed'),
(325, 8221342, 'CO356', '1st', '2025-2026', 1.90, 'Passed'),
(326, 8221342, 'CO358', '1st', '2025-2026', 1.70, 'Passed'),
(327, 8221342, 'CO357', '1st', '2025-2026', 2.30, 'Passed'),
(328, 8221342, 'CO362', '1st', '2025-2026', 2.50, 'Passed'),
(329, 8221342, 'CO363', '1st', '2025-2026', 2.10, 'Passed'),
(330, 8221342, 'CO359', '1st', '2025-2026', 2.00, 'Passed'),
(331, 8221342, 'CO364', '1st', '2025-2026', 1.90, 'Passed'),
(332, 8221342, 'C076', '2nd', '2025-2026', 2.50, 'Passed'),
(333, 8221342, 'C073', '2nd', '2025-2026', 1.90, 'Passed'),
(334, 8221342, 'C074', '2nd', '2025-2026', 2.00, 'Passed'),
(335, 8221342, 'C070', '2nd', '2025-2026', 2.10, 'Passed'),
(336, 8221342, 'C075', '2nd', '2025-2026', 2.40, 'Passed'),
(337, 8221342, 'C077', '2nd', '2025-2026', 1.80, 'Passed'),
(338, 8221342, 'C071', '2nd', '2025-2026', 2.30, 'Passed'),
(339, 8221342, 'C072', '2nd', '2025-2026', 2.40, 'Passed'),
(340, 8221342, 'CO158', '1st', '2025-2026', 1.90, 'Passed'),
(341, 8221342, 'CO152', '1st', '2025-2026', 2.00, 'Passed'),
(342, 8221342, 'CO153', '1st', '2025-2026', 2.30, 'Passed'),
(343, 8221342, 'CO154', '1st', '2025-2026', 2.20, 'Passed'),
(344, 8221342, 'CO155', '1st', '2025-2026', 2.00, 'Passed'),
(345, 8221342, 'CO156', '1st', '2025-2026', 1.90, 'Passed'),
(346, 8221342, 'CO157', '1st', '2025-2026', 2.40, 'Passed'),
(347, 8221342, 'COB4', '2nd', '2025-2026', 1.90, 'Passed'),
(348, 8221342, 'C085', '2nd', '2025-2026', 2.20, 'Passed'),
(349, 8221342, 'C078', '2nd', '2025-2026', 1.80, 'Passed'),
(350, 8221342, 'C079', '2nd', '2025-2026', 2.00, 'Passed'),
(351, 8221342, 'C081', '2nd', '2025-2026', 2.10, 'Passed'),
(352, 8221342, 'C082', '2nd', '2025-2026', 2.00, 'Passed'),
(353, 8221342, 'C083', '2nd', '2025-2026', 2.30, 'Passed'),
(354, 8221342, 'C080', '2nd', '2025-2026', 2.30, 'Passed'),
(355, 8221342, 'CO164', '1st', '2025-2026', 2.10, 'Passed'),
(356, 8221342, 'CO163', '1st', '2025-2026', 1.90, 'Passed'),
(357, 8221342, 'CO159', '1st', '2025-2026', 2.40, 'Passed'),
(358, 8221342, 'CO160', '1st', '2025-2026', 2.10, 'Passed'),
(359, 8221342, 'CO161', '1st', '2025-2026', 2.10, 'Passed'),
(360, 8221342, 'CO162', '1st', '2025-2026', 2.30, 'Passed'),
(361, 8221380, 'CO360', '1st', '2025-2026', 1.00, 'Passed'),
(362, 8221380, 'CO361', '1st', '2025-2026', 2.00, 'Passed'),
(363, 8221380, 'CO356', '1st', '2025-2026', 3.00, 'Passed'),
(364, 8221380, 'CO358', '1st', '2025-2026', 2.00, 'Passed'),
(365, 8221380, 'CO357', '1st', '2025-2026', 2.00, 'Passed'),
(366, 8221380, 'CO362', '1st', '2025-2026', 3.00, 'Passed'),
(367, 8221380, 'CO363', '1st', '2025-2026', 1.00, 'Passed'),
(368, 8221380, 'CO359', '1st', '2025-2026', 2.00, 'Passed'),
(369, 8221380, 'CO364', '1st', '2025-2026', 3.00, 'Passed'),
(370, 8221380, 'C076', '2nd', '2025-2026', 1.00, 'Passed'),
(371, 8221380, 'C073', '2nd', '2025-2026', 2.00, 'Passed'),
(372, 8221380, 'C074', '2nd', '2025-2026', 1.00, 'Passed'),
(373, 8221380, 'C070', '2nd', '2025-2026', 3.40, 'Failed'),
(374, 8221380, 'C075', '2nd', '2025-2026', 3.20, 'Failed'),
(375, 8221380, 'C077', '2nd', '2025-2026', 4.00, 'Failed'),
(376, 8221380, 'C071', '2nd', '2025-2026', 3.40, 'Failed'),
(377, 8221380, 'C072', '2nd', '2025-2026', 2.00, 'Passed'),
(378, 8221380, 'CO158', '1st', '2025-2026', 1.00, 'Passed'),
(379, 8221380, 'CO152', '1st', '2025-2026', 4.00, 'Failed'),
(380, 8221380, 'CO153', '1st', '2025-2026', 3.40, 'Failed'),
(381, 8221380, 'CO154', '1st', '2025-2026', 3.40, 'Failed'),
(382, 8221380, 'CO155', '1st', '2025-2026', 2.00, 'Passed'),
(383, 8221380, 'CO156', '1st', '2025-2026', 3.00, 'Passed'),
(384, 8221380, 'CO157', '1st', '2025-2026', 2.00, 'Passed'),
(385, 8221380, 'COB4', '2nd', '2025-2026', 0.00, 'INC'),
(386, 8221380, 'C085', '2nd', '2025-2026', 0.00, 'INC'),
(387, 8221380, 'C078', '2nd', '2025-2026', 0.00, 'INC'),
(388, 8221380, 'C079', '2nd', '2025-2026', 0.00, 'INC'),
(389, 8221380, 'C081', '2nd', '2025-2026', 0.00, 'INC'),
(390, 8221380, 'C082', '2nd', '2025-2026', 0.00, 'INC'),
(391, 8221380, 'C083', '2nd', '2025-2026', 0.00, 'INC'),
(392, 8221380, 'C080', '2nd', '2025-2026', 0.00, 'INC'),
(393, 8221380, 'CO164', '1st', '2025-2026', 0.00, 'INC'),
(394, 8221380, 'CO163', '1st', '2025-2026', 0.00, 'INC'),
(395, 8221380, 'CO159', '1st', '2025-2026', 0.00, 'INC'),
(396, 8221380, 'CO160', '1st', '2025-2026', 0.00, 'INC'),
(397, 8221380, 'CO161', '1st', '2025-2026', 0.00, 'INC'),
(398, 8221380, 'CO162', '1st', '2025-2026', 0.00, 'INC'),
(399, 8221380, 'C0110', '2nd', '2025-2026', 0.00, 'INC'),
(400, 8252983, 'CO197', '1st', '2025-2026', 2.00, 'Passed'),
(401, 8252983, 'CO194', '1st', '2025-2026', 1.00, 'Passed'),
(402, 8252983, 'CO195', '1st', '2025-2026', 2.00, 'Passed'),
(403, 8252983, 'CO196', '1st', '2025-2026', 2.00, 'Passed'),
(404, 8252983, 'CO192', '1st', '2025-2026', 3.00, 'Passed'),
(405, 8252983, 'CO191', '1st', '2025-2026', 2.00, 'Passed'),
(406, 8252983, 'CO193', '1st', '2025-2026', 2.00, 'Passed'),
(407, 8252983, 'CO199', '1st', '2025-2026', 1.00, 'Passed'),
(408, 8252983, 'CO198', '1st', '2025-2026', 3.00, 'Passed'),
(409, 8252983, 'C039', '2nd', '2025-2026', 1.00, 'Passed'),
(410, 8252983, 'C036', '2nd', '2025-2026', 2.00, 'Passed'),
(411, 8252983, 'C037', '2nd', '2025-2026', 1.00, 'Passed'),
(412, 8252983, 'C032', '2nd', '2025-2026', 1.00, 'Passed'),
(413, 8252983, 'C033', '2nd', '2025-2026', 1.00, 'Passed'),
(414, 8252983, 'C034', '2nd', '2025-2026', 1.00, 'Passed'),
(415, 8252983, 'C035', '2nd', '2025-2026', 1.00, 'Passed'),
(416, 8252983, 'C041', '2nd', '2025-2026', 1.00, 'Passed'),
(417, 8252983, 'C038', '2nd', '2025-2026', 1.00, 'Passed'),
(418, 8252983, 'C040', '2nd', '2025-2026', 1.00, 'Passed'),
(419, 8252984, 'CO197', '1st', '2025-2026', 1.00, 'Passed'),
(420, 8252984, 'CO194', '1st', '2025-2026', 1.00, 'Passed'),
(421, 8252984, 'CO195', '1st', '2025-2026', 1.00, 'Passed'),
(422, 8252984, 'CO196', '1st', '2025-2026', 2.00, 'Passed'),
(423, 8252984, 'CO192', '1st', '2025-2026', 2.00, 'Passed'),
(424, 8252984, 'CO191', '1st', '2025-2026', 1.00, 'Passed'),
(425, 8252984, 'CO193', '1st', '2025-2026', 1.00, 'Passed'),
(426, 8252984, 'CO199', '1st', '2025-2026', 2.00, 'Passed'),
(427, 8252984, 'CO198', '1st', '2025-2026', 2.00, 'Passed'),
(428, 8252984, 'C039', '2nd', '2025-2026', 2.00, 'Passed'),
(429, 8252984, 'C036', '2nd', '2025-2026', 1.00, 'Passed'),
(430, 8252984, 'C037', '2nd', '2025-2026', 2.00, 'Passed'),
(431, 8252984, 'C032', '2nd', '2025-2026', 1.00, 'Passed'),
(432, 8252984, 'C033', '2nd', '2025-2026', 1.00, 'Passed'),
(433, 8252984, 'C034', '2nd', '2025-2026', 1.00, 'Passed'),
(434, 8252984, 'C041', '2nd', '2025-2026', 2.00, 'Passed'),
(435, 8252984, 'C035', '2nd', '2025-2026', 2.00, 'Passed'),
(436, 8252984, 'C040', '2nd', '2025-2026', 1.00, 'Passed'),
(437, 8252984, 'C038', '2nd', '2025-2026', 1.00, 'Passed');

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
(1, 'Admin For All', '$2b$10$lyUyszLfMtll1Wd8UYlndOlyPq5gZm7L4dmAM7k5JKMszMK7oO3rW', 'martin.tuico@gmail.com', 0, NULL, NULL, '2025-10-25 04:59:01'),
(2, 'fritz', '$2b$10$lyUyszLfMtll1Wd8UYlndOlyPq5gZm7L4dmAM7k5JKMszMK7oO3rW', 'kfritzlima@gmail.com', 0, '852358', '2025-12-03 02:48:15', '2025-12-01 21:55:38');

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
(1, 'CoTE', 'College of Technology Engineering'),
(2, 'CoED', 'College of Education Department'),
(3, 'CoF', 'College of Fisheries'),
(4, 'CME', 'College of Management and Entrepreneurship');

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
(8, 8221355, 1, NULL, '2025-2026', '2nd', 0.0),
(10, 8221237, 2, NULL, '2025-2026', '2nd', 9.0),
(11, 8221348, 3, NULL, '2025-2026', '2nd', 9.0),
(12, 8220865, 1, NULL, '2025-2026', '2nd', 0.0),
(13, 8221327, 1, NULL, '2025-2026', '2nd', 0.0),
(15, 8221237, 0, NULL, '2025-2026', '1st', 25.0),
(16, 8220890, 3, NULL, '2025-2026', '1st', 17.0),
(17, 8221248, 1, NULL, '2025-2026', '1st', 0.0),
(18, 8221348, 3, NULL, '2025-2026', '1st', 17.0),
(19, 8220812, 1, NULL, '2025-2026', '1st', 0.0),
(20, 8221335, 3, NULL, '2025-2026', '1st', 28.0),
(21, 8240426, 1, NULL, '2025-2026', '1st', 0.0),
(22, 8240385, 1, NULL, '2025-2026', '1st', 0.0),
(23, 8220826, 3, NULL, '2025-2026', '1st', 25.0),
(24, 8221327, 1, NULL, '2025-2026', '1st', 0.0),
(25, 8221342, 1, NULL, '2025-2026', '2nd', 0.0),
(26, 8221335, 2, NULL, '2025-2026', '2nd', 9.0),
(27, 8221335, 0, NULL, '2025-2026', '1st', 0.0),
(28, 8221335, 1, NULL, '2025-2026', '1st', 0.0),
(29, 8220826, 0, NULL, '2025-2026', '2nd', 0.0),
(30, 8221380, 3, NULL, '2025-2026', '1st', 0.0),
(31, 8221380, 3, NULL, '2025-2026', '2nd', 23.0),
(32, 8252981, 1, NULL, '2025-2026', '2nd', 0.0),
(33, 8220849, 1, NULL, '2025-2026', '2nd', 0.0),
(34, 8220692, 3, NULL, '2025-2026', '2nd', 9.0);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_subjects`
--

CREATE TABLE `enrollment_subjects` (
  `enrollment_id` int(11) NOT NULL,
  `subject_section` varchar(255) NOT NULL
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
(3, 'CO364'),
(5, 'C039'),
(6, 'C032'),
(6, 'C033'),
(6, 'C034'),
(6, 'C035'),
(6, 'C036'),
(6, 'C037'),
(6, 'C038'),
(6, 'C039'),
(6, 'C040'),
(6, 'C041'),
(7, 'C032'),
(7, 'C033'),
(7, 'C034'),
(7, 'C035'),
(7, 'C036'),
(7, 'C037'),
(7, 'C038'),
(7, 'C039'),
(7, 'C040'),
(7, 'C041'),
(10, 'C0110'),
(11, 'C0110'),
(15, 'CO191'),
(15, 'CO192'),
(15, 'CO193'),
(15, 'CO194'),
(15, 'CO195'),
(15, 'CO196'),
(15, 'CO197'),
(15, 'CO198'),
(15, 'CO199'),
(16, 'CO159'),
(16, 'CO160'),
(16, 'CO161'),
(16, 'CO162'),
(16, 'CO163'),
(16, 'CO164'),
(18, 'CO159'),
(18, 'CO160'),
(18, 'CO161'),
(18, 'CO162'),
(18, 'CO163'),
(18, 'CO164'),
(20, 'CO191'),
(20, 'CO192'),
(20, 'CO193'),
(20, 'CO194'),
(20, 'CO195'),
(20, 'CO196'),
(20, 'CO197'),
(20, 'CO198'),
(20, 'CO199'),
(20, 'CO356'),
(23, 'CO191'),
(23, 'CO192'),
(23, 'CO193'),
(23, 'CO194'),
(23, 'CO195'),
(23, 'CO196'),
(23, 'CO197'),
(23, 'CO198'),
(23, 'CO199'),
(26, 'C0110'),
(31, 'C039'),
(31, 'C070'),
(31, 'C071'),
(31, 'C075'),
(31, 'C077'),
(31, 'C078'),
(31, 'C081'),
(31, 'COB4'),
(34, 'C0110');

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
(123123, 'Martin Luther', 'Tuico', 'martin@gmail.com', '$2b$10$UEs4tFQDjidG5if1hBn.2O4Wg7cFniTMemJWdMLX2WDCL7zIX5clu', 1, 'NA', 'dean', 1, '2025-11-19 09:15:07', '2025-11-19 09:10:09', '2025-12-21 17:08:39'),
(123124, 'Kfritz', 'Lima', 'fritz@gmail.com', '$2b$10$aMet.M9xku9YP7ghZMGTE.kb5V6aykp1mOLoe50Bz5VrTQJWwztDq', 1, NULL, 'grader', 1, NULL, '2025-12-07 23:00:54', '2025-12-21 17:08:56'),
(123126, 'Gerlie', 'Linabog', 'gerlielinabog@gmail.com', '$2b$10$XbNfi.GxDGXTaCxzjLSu.e0ULI4FRFJw5Nl2K8pR1WqYfgvaXwPsu', 1, NULL, 'advisor', 1, NULL, '2025-12-08 12:19:26', '2025-12-08 12:19:26');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_subjects`
--

CREATE TABLE `faculty_subjects` (
  `faculty_subject_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `year_level` int(11) NOT NULL,
  `section` varchar(50) NOT NULL,
  `academic_year` varchar(9) NOT NULL,
  `semester` enum('1st','2nd') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty_subjects`
--

INSERT INTO `faculty_subjects` (`faculty_subject_id`, `faculty_id`, `subject_code`, `year_level`, `section`, `academic_year`, `semester`) VALUES
(16, 123125, 'GEC-PC', 1, 'A', '2025-2026', '2nd'),
(17, 123125, 'GEE-GSPS', 1, 'A', '2025-2026', '2nd'),
(22, 123126, 'PC 4215', 4, 'A', '2025-2026', '2nd'),
(27, 123123, 'GEE-GSPS', 1, 'B/C', '2025-2026', '2nd'),
(28, 123123, 'GEC-E', 2, 'A/B', '2025-2026', '2nd'),
(46, 123124, 'GEC-PC', 1, 'A', '2025-2026', '2nd'),
(47, 123124, 'PC 224', 2, 'A/B', '2025-2026', '2nd'),
(48, 123124, 'PC 3211', 3, 'C/D', '2025-2026', '2nd'),
(49, 123124, 'AP 5', 3, 'A/C', '2025-2026', '2nd'),
(50, 123124, 'CC 225', 2, 'A', '2025-2026', '2nd');

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
(2, 'student', 8220692, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-26 02:23:10', '2025-11-26 09:40:30'),
(3, 'student', 8220692, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-27 12:12:20', '2025-11-28 12:05:05'),
(4, 'student', 8221380, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-27 16:10:38', '2025-11-28 06:46:00'),
(5, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 1, '2025-11-28 16:58:39', '2025-11-28 19:09:15'),
(6, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 1, '2025-11-28 16:58:40', '2025-11-28 19:09:16'),
(7, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:41', '2025-11-28 19:09:23'),
(8, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:41', '2025-11-28 19:09:23'),
(9, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 1, '2025-11-28 16:58:41', '2025-11-28 19:09:17'),
(10, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:42', '2025-11-28 19:09:24'),
(11, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:42', '2025-11-28 19:09:20'),
(12, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:42', '2025-11-28 19:09:21'),
(13, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:42', '2025-11-28 19:09:22'),
(14, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-28 16:58:56', '2025-11-29 03:14:29'),
(15, 'student', 8221348, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 1, 1, 1, '2025-11-28 19:18:58', '2025-12-08 06:51:45'),
(16, 'student', 8220865, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-11-28 19:19:03', '2025-11-28 19:19:03'),
(17, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-28 19:19:09', '2025-11-30 23:20:22'),
(18, 'student', 8221355, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-11-28 19:19:17', '2025-11-28 19:19:17'),
(19, 'student', 1, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-11-28 19:19:29', '2025-11-29 23:45:33'),
(20, 'student', 8221380, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-11-29 23:24:46', '2025-12-08 16:08:46'),
(21, 'student', 1, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-11-30 11:50:18', '2025-11-30 11:50:29'),
(22, 'student', 8220692, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-11-30 12:01:25', '2025-11-30 12:10:34'),
(23, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-11-30 12:09:28', '2025-11-30 12:10:34'),
(24, 'student', 8220692, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-11-30 12:09:31', '2025-11-30 12:10:34'),
(25, 'student', 1, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-11-30 12:12:34', '2025-11-30 12:13:24'),
(26, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-11-30 23:19:11', '2025-11-30 23:20:21'),
(27, 'student', 8220890, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-02 00:33:01', '2025-12-02 00:33:01'),
(28, 'student', 8221248, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-02 00:33:25', '2025-12-02 00:33:25'),
(29, 'student', 8221348, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 1, 1, 1, '2025-12-02 00:35:54', '2025-12-08 06:51:44'),
(30, 'student', 8220812, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-02 01:11:15', '2025-12-02 01:12:06'),
(31, 'student', 8220890, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-02 01:11:20', '2025-12-02 01:11:20'),
(32, 'student', 8221335, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-02 01:15:29', '2025-12-02 01:16:43'),
(33, 'student', 8221237, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-12-02 01:15:37', '2025-12-08 20:13:06'),
(34, 'student', 8221348, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-12-02 01:16:24', '2025-12-08 06:51:44'),
(35, 'student', 8221335, 'Enrollment Revoked', 'Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-02 01:19:34', '2025-12-08 13:17:39'),
(36, 'student', 8221335, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-02 03:48:49', '2025-12-08 13:17:39'),
(37, 'student', 8240426, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 1, 1, 0, '2025-12-02 11:25:22', '2025-12-02 11:26:40'),
(38, 'student', 8240385, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-02 13:11:52', '2025-12-02 13:11:52'),
(39, 'student', 8220826, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-04 06:11:39', '2025-12-04 06:13:39'),
(40, 'student', 8220826, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-12-04 06:12:18', '2025-12-04 06:13:40'),
(41, 'student', 8221327, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 03:09:37', '2025-12-08 03:09:37'),
(42, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 03:12:26', '2025-12-08 20:13:06'),
(43, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 03:13:36', '2025-12-08 20:13:05'),
(44, 'student', 8221335, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 06:43:49', '2025-12-08 13:17:39'),
(45, 'student', 8221335, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 06:43:50', '2025-12-08 13:17:39'),
(46, 'student', 8221348, 'Enrollment Revoked', 'Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-12-08 06:47:55', '2025-12-08 06:51:43'),
(47, 'student', 8221348, 'Enrollment Confirmed', 'Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 1, '2025-12-08 06:48:51', '2025-12-08 06:51:43'),
(48, 'student', 8221335, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 12:48:13', '2025-12-08 13:17:39'),
(49, 'student', 8221335, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 12:50:12', '2025-12-08 13:17:39'),
(50, 'student', 8221335, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 12:50:13', '2025-12-08 13:17:39'),
(51, 'student', 8221380, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 13:14:01', '2025-12-08 16:07:25'),
(52, 'student', 8221342, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 14:04:45', '2025-12-08 14:07:05'),
(53, 'student', 8221342, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 14:04:52', '2025-12-08 14:07:05'),
(54, 'student', 8220849, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:04:47', '2025-12-08 16:04:47'),
(55, 'student', 8220865, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:04:50', '2025-12-08 16:04:50'),
(56, 'student', 8220865, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:04:51', '2025-12-08 16:04:51'),
(57, 'student', 8221327, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:04:52', '2025-12-08 16:04:52'),
(58, 'student', 8221327, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:04:55', '2025-12-08 16:04:55'),
(59, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 16:04:59', '2025-12-08 20:13:05'),
(60, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 16:04:59', '2025-12-08 20:13:06'),
(61, 'student', 8221335, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 16:05:03', '2025-12-09 04:00:11'),
(62, 'student', 8221335, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 16:05:04', '2025-12-09 04:00:11'),
(63, 'student', 8221380, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 16:05:06', '2025-12-08 16:07:25'),
(64, 'student', 8221380, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 16:05:09', '2025-12-08 16:07:25'),
(65, 'student', 8252981, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:05:19', '2025-12-08 16:05:19'),
(66, 'student', 8252981, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 0, 0, '2025-12-08 16:05:20', '2025-12-08 16:05:20'),
(67, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 20:10:55', '2025-12-08 20:13:03'),
(68, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 20:10:55', '2025-12-08 20:13:05'),
(69, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 20:10:56', '2025-12-08 20:13:01'),
(70, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 1, '2025-12-08 20:11:27', '2025-12-08 20:13:00'),
(71, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 20:14:01', '2025-12-08 20:24:49'),
(72, 'student', 8221237, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 20:14:04', '2025-12-08 20:24:49'),
(73, 'student', 8221237, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-08 20:14:08', '2025-12-08 20:24:49'),
(74, 'student', 8221380, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-09 01:33:52', '2025-12-09 01:54:26'),
(75, 'student', 8221380, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-09 04:03:00', '2025-12-09 04:23:29'),
(76, 'student', 8221380, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-09 04:03:01', '2025-12-09 04:23:29'),
(77, 'student', 8220692, 'Clearance Status Updated', '❌ Your clearance has been revoked.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-09 05:46:26', '2025-12-09 06:27:34'),
(78, 'student', 8220692, 'Clearance Status Updated', '✅ Your clearance has been confirmed. You can now proceed to enrollment.', 'enrollment', '/enroll', NULL, 'admin', 0, 1, 0, '2025-12-09 05:46:26', '2025-12-09 06:27:34'),
(79, 'student', 8220692, 'Enrollment Revoked', '❌ Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-22 00:42:38', '2025-12-22 00:42:38'),
(80, 'student', 8220692, 'Enrollment Revoked', '❌ Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-22 00:42:38', '2025-12-22 00:42:38'),
(81, 'student', 8220692, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-22 00:47:05', '2025-12-22 00:47:05'),
(82, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:04:48', '2026-03-07 00:39:59'),
(83, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:05:37', '2026-03-07 00:39:59'),
(84, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:05:37', '2026-03-07 00:39:59'),
(85, 'student', 8220692, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-22 01:05:53', '2025-12-22 01:05:53'),
(86, 'student', 8220692, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 0, 0, '2025-12-22 01:05:53', '2025-12-22 01:05:53'),
(87, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:04', '2026-03-07 00:39:59'),
(88, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:06', '2026-03-07 00:39:59'),
(89, 'student', 8221380, 'Enrollment Revoked', '❌ Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:07', '2026-03-07 00:39:59'),
(90, 'student', 8221380, 'Enrollment Revoked', '❌ Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:07', '2026-03-07 00:39:59'),
(91, 'student', 8221380, 'Enrollment Revoked', '❌ Your enrollment has been revoked by the administrator.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:07', '2026-03-07 00:39:59'),
(92, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:08', '2026-03-07 00:39:59'),
(93, 'student', 8221380, 'Enrollment Confirmed', '✅ Your enrollment request has been confirmed.', 'enrollment', '/enrollment', NULL, 'admin', 0, 1, 0, '2025-12-22 01:06:08', '2026-03-07 00:39:59');

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
  `program_code` varchar(50) NOT NULL,
  `program_name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`program_id`, `program_code`, `program_name`, `department_id`) VALUES
(1, 'BSIT', 'Bachelor of Science in Information Technology', 1),
(2, 'BSEd', 'Bachelor of Secondary Education', 2),
(3, 'BSHM', 'Bachelor of Science in Hospitality Management', 4);

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
(1, '2025-07-16', '2025-07-30', '2025-06-30', '2025-11-29', '2025-12-07', '2025-12-23', '2025-11-30', '2026-04-28', '2026-05-18', '2026-07-01', '2025-2026', '2025-12-21 16:22:42');

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
(8150676, 'Clifford Froilan', '', 'Cabucos', 'cabucosclifford@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8180531, 'Dendo', 'L.', 'Dianing', 'odneddodong@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8190151, 'Gerry John', ' A. ', 'Frias', 'johngerreyone@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8210780, 'John Fernand', NULL, 'Bauno', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8210885, 'Emmanuel Philip', 'D', 'Godin', 'matrixsatoshi@gmail.com', NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8210967, 'Bbertkenn', NULL, 'De Arca', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8211313, 'Jivie ', 'M.', ' Tolo', 'jivietolo404@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8212922, 'Hardly ', NULL, 'Cagado', 'hrdlyrss@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8212987, 'Alvin', 'M', 'Bantilan', 'bantilanalvin11@gmail.com', NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 3, 4, 'A', 'Irregular', 0, 0),
(8220692, 'Chariss', 'Gabaran', 'Lumongsod', 'charisslumongsod@gmail.com', '091231232342', '/uploads/profile_pictures/1765379849367-88095979.jpeg', 'Sala Maya Daanbantayan, Cebu', 'IV', 'VII', 'Female', '2003-12-25', 'Daanbantayan, Cebu', 'Filipino', 'BNINBB', 'Single', 'Roberto Lumongsod', 'N/A', '099273346664', 'Cherina Lumongsod', 'None', NULL, NULL, NULL, NULL, NULL, '$2b$10$1FTHfETLJZywfZSJRHKzqOSCRUDZgS9D5eAqjkW9ZA8mvz/Fxlwx.', 1, 4, 'A', 'Regular', 1, 1),
(8220791, 'Angel', 'E', 'Malinao', 'malinaoangel88@gmail.com', NULL, NULL, 'Flores Mabago, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220796, 'Dave Anton ', 'O. ', 'Mapait', 'escanorthe6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8220799, 'Adriane', 'V', 'Almaden', NULL, NULL, NULL, 'Bateria Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220802, 'Daphne Yvonne', 'V', 'Mondejar', 'mondedaphne11@gmail.com', NULL, NULL, 'Riverside Maya, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220812, 'Cassey', 'O', 'Gulfan', 'rokukat28@gmail.com', NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$VddVQ4wyB9KQFxvFXXfMLeP1l5XOH/0hagvX2.34BQ.NVhcgnzCUy', 1, 4, 'A', 'Regular', 1, 0),
(8220818, 'Manolito Rey Jr.', 'O', 'Quimada', NULL, NULL, NULL, 'Somimbang Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220825, 'Glenford', NULL, 'Ancao', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8220826, 'Roland', 'L', 'Abellanosa', 'rolandabellanosa321@gmail.com', '09947607066', NULL, 'M Cabangcalan Dakit Bogo City Cebu', 'IV', 'VII', 'Male', '2025-11-28', 'Bogo City, Cebu', 'Filipino', 'Catholic ', 'Single', 'George', 'N/A', NULL, 'Loren', 'N/A', NULL, 'N/A', 'N/A', '093983838388', NULL, '$2b$10$geLCcplKPDZNLAtith1Z6eZGGDQfJ2AxRuFlT6JjvBJDEVs1/jAc2', 1, 4, 'A', 'Regular', 1, 1),
(8220838, 'Mavene', 'F', 'Dinoy', 'dinoymavene7@gmail.com', NULL, NULL, 'Tindog, Medellin, Cebu', 'IV', 'VII', 'Female', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220841, 'Niña Pamela', 'P', 'Tibay', 'ninapamelatibay@gmail.com', NULL, NULL, 'Langub Sta. Fe Cebu', 'IV', 'VII', 'Female', NULL, 'Sta. Fe, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220849, 'Chris', 'S', 'Bacunador', NULL, NULL, NULL, 'Lib-og 2 Lanao, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220860, 'John Lloyd', 'C', 'Dela Rama', 'johnlloyddelarama59@gmail.com', NULL, NULL, 'Don Virgilio Gonzales Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220865, 'Christian', 'Arcenal', 'Calderon', 'arcenalchristian06@gmail.com', '09273669761', NULL, 'Bagay, Daanbantayan, Cebu', 'IV', 'VII', 'Male', '1996-05-06', 'Daanbantayan, Cebu', 'Filipino', 'Born Again', 'Single', 'Crispin Calderon', 'Deceased', NULL, 'Robina Calderon', 'House Helper', NULL, 'Robina Calderon', 'Mother', '09935095103', NULL, '$2b$10$TLFgD1Gzk.r8LFVujWx9zutfpa7OnylhB4CPYRTgH5ZOBhOI8UNcO', 1, 4, 'A', 'Regular', 1, 0),
(8220890, 'Keith Arleanne', 'D', 'Pasaol', 'keith2delarama@gmail.com', '09202199794', NULL, 'Purok Rosal 6 Gairan, Bogo City, Cebu', 'IV', 'VII', 'Female', '2003-10-07', 'Bogo City, Cebu', 'Filipino', 'Roman Catholic', 'Single', 'Arvin Pasaol', 'Seaman', 'N/A', 'Edwilynn', 'Housewife', 'N/A', 'Edwilynn Pasaol', 'Mother', 'N/A', 'N/A', '$2b$10$.u52IqTKn8tRZWgu0pMQNea1Jb0LRHvmAg6GB.G9BuPi3KydlKad.', 1, 4, 'A', 'Regular', 1, 0),
(8220905, 'Mark Cleo', 'J', 'Calbang', 'markcleocalbang05@gmail.com', NULL, NULL, 'Luy-a, Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220915, 'Zynah Claire', 'C', 'Umpad', 'zynatics1111@gmail.com', NULL, NULL, 'Uma, Tindog, Medellin, Cebu', 'IV', 'VII', 'Female', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220932, 'Janna Krista Kim', 'R', 'Coyoca', NULL, NULL, NULL, 'Poblacion, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8220933, 'Kaye', 'Y', 'Diaz', NULL, NULL, NULL, 'Suba, Malbago, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221020, 'Matthew Gayle', NULL, 'Pepito', 'pepitomatthewgayle@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Irregular', 0, 0),
(8221024, 'Francis Keith', 'Moralde', 'Banan', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Irregular', 0, 0),
(8221142, 'David Sun', NULL, 'Damayo', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'D', 'Regular', 0, 0),
(8221154, 'Angelie', 'S', 'Arranguez', 'angeliearranguez123@gmail.com', NULL, NULL, 'Paypay Daanbantayan Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221156, 'Roselyn', 'Arriesgado', 'Arenas', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221194, 'Jade Emmarie', NULL, 'Arreglo', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'B', 'Regular', 0, 0),
(8221196, 'Christopher', 'M', 'Aluba', NULL, NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221201, 'Leonides', NULL, 'Conde Jr.', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221204, 'Karl', 'A', 'Noynay', 'karlnoynay523@gmail.com', NULL, NULL, 'Antipolo Medellin, Cebu', 'IV', 'VII', 'Male', NULL, 'Medellin, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221207, 'Charlie', 'Ugay', 'Achapero', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Irregular', 0, 0),
(8221220, 'Mac Jason', ' A. ', 'Broñola ', 'macjasonb@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221224, 'Dyna Rose', 'P', 'Aragon', 'dynarosearagon@gmail.com', NULL, NULL, 'Aluba, Bitoon Daanbantayan Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221231, 'Hannah Israela', 'D', 'Godin', 'hannahgodin8@gmail.com', NULL, NULL, 'Bitoon, Daanbantayan, Cebu', 'IV', 'VII', 'Female', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221237, 'Gerlie', 'Icot', 'Linabog', 'gerlielinabog@gmail.com', '09927765561', '/uploads/profile_pictures/1764923197788-644071566.jpeg', 'Bagay, Daanbantayan, Cebu ', '4', '7', 'Male', '2003-06-15', 'Bagay', 'Filipino ', 'Roman Catholic ', 'Single', 'Roger Linabog ', 'N/A', '09997532152', 'Rosalia Linabog ', 'N/A', '09551217657', 'Rosalia Linabog ', 'Mother ', '09551217657', NULL, '$2b$10$jgbCGjLl9zaKVseSnRKpM.yS.i1UDaMe2ZAPmpAy767PYLzqRKvbS', 1, 4, 'A', 'Regular', 1, 1),
(8221243, 'Ronmar ', 'R. ', 'Clamares ', 'maroysky460@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'D', 'Regular', 0, 0),
(8221248, 'Lawrence ', 'L. ', 'Ledesma', 'ledesmalawrence8@gmail.com', '123456789', NULL, 'Matab-ang', 'Meet', 'Cebu', 'Male', '2001-10-15', 'Matab-ang', 'Filipino', 'Catholic', 'Single', 'Bradix', 'N/A', 'N/A', 'Dolor', 'N/A', 'N/A', 'Shinra', 'Mother', 'N/A', 'N/A', '$2b$10$8X8YgpDEJnmReOOknBmp7ezy0CKgraSknUxtSlg7GzlSMskRdaF4e', 1, 3, 'A', 'Irregular', 1, 0),
(8221256, 'Noli ', 'D. ', 'Casas Jr.', 'casasnoli13@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221271, 'Tristan Rey ', 'D. ', 'Vasquez', 'tristanreyvasquez022404@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221278, 'Christy', NULL, 'Asis', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221287, 'Ella', NULL, 'Pasohil', 'ellapasohil665@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221295, 'John Moses ', 'R. ', 'Puyot', 'puyotjohnmoses@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221297, 'Renz', 'C', 'Lanza', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221301, 'Franz Louise', NULL, 'Coyoca', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221303, 'Jemay', NULL, 'Arriesgado', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221310, 'Clarence', 'T', 'Simoran', 'clarencesimoran1@gmail.com', NULL, NULL, 'Sitio Paril, Lamintak Sur', 'IV', 'VII', 'Male', NULL, 'Lamintak Sur', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221327, 'Christian Joy', 'D', 'Bugtong', 'christianbugtongjoy76@gmail.com', NULL, NULL, 'Cabatuan, Tominjao, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$8sBafJ7frdm0gTswklECkuLqDxfRFjcDY2RqRLn1qQtnZpMrRXTou', 1, 4, 'A', 'Regular', 1, 0),
(8221332, 'Gerica ', 'L', 'Cañete', 'canetegerica287@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221334, 'Rolando Jr.', 'R', 'Lima', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Male', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221335, 'Kfritz  ', 'R.', 'Lima', 'kfritzlima@gmail.com', '09942735952', NULL, 'Odlot Bogo City, Cebu', '4', 'VII', 'Male', '2003-06-01', 'Cebu City', 'Filipino', 'Catholic', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$V/ooMgdCz5Lm06/COJpxE.J320PmSG0p7cJCI7sj21oOfhwGHnbt6', 1, 4, 'A', 'Regular', 1, 1),
(8221340, 'Maery Carmel ', 'D. ', 'Rosales', 'rosalesmaerycarmel@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221342, 'Ravenson', 'A', 'Tayong', 'ravensontayong15@gmail.com', '09123445521', NULL, 'Poblacion Daanbantayan Cebu', 'IV', 'VII', 'Male', '2003-01-28', 'Daanbantayan, Cebu', 'Filipino', 'Catholic', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$35lVndbXhp0RNwjxpsXQHOHpKtFTC9CKFd6mU/PJ9sGWYulbXoo5a', 1, 4, 'A', 'Regular', 1, 0),
(8221346, 'Christina ', 'M. ', 'Pepito ', 'christinapepito539@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221348, 'Bennie', 'A', 'Pinote', 'benniepinote2003@gmail.com', '09638087620', NULL, 'Tawagan, Poblacion, Medellin, Cebu', 'IV', 'VII', 'Male', '2003-08-20', 'Medellin, Cebu', 'Filipino', 'Catholic ', 'Single', 'Benhur Pinote', 'Security Guard', 'N/A', 'Julieta Pinote ', 'N/A', '09932249487', 'Julieta Pinote ', 'Son', '09932249487', 'N/A', '$2b$10$Idf4f0/IVF8z2VfJCqXL9extTOL0TkIlZeC3JnhleCpcS5YgKxq2K', 1, 4, 'A', 'Regular', 1, 1),
(8221352, 'Mary Mechille', 'L', 'Doble', NULL, NULL, NULL, NULL, 'IV', 'VII', 'Female', NULL, NULL, 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221354, 'Reliza ', 'A. ', 'Mongaya ', 'azilerayagnom@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221355, 'Kenthjosh', 'IDK HAHA', 'Oyao', 'oyaokenthjosh@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'D', 'Regular', 1, 0),
(8221359, 'Goldenmay', 'E', 'Sarol', NULL, NULL, NULL, 'Hagdan, Santa Fe, Cebu', 'IV', 'VII', 'Female', NULL, 'Santa Fe, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221360, 'Yvonnie ', NULL, 'Durano', 'yvonniedurano19@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221366, 'NIN KYLLE ', 'ALBARANDO ', 'VALIENTE', 'ninkyllevaliente15@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'B', 'Regular', 0, 0),
(8221370, 'Reynaliza', NULL, ' Montesclaros ', 'reynalisamontesclaros19@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221377, 'Jeancin ', 'S. ', 'Tejeno', 'jeancintejeno16@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221380, 'Martin Luther', 'Valiente', 'Tuico', 'martin.tuico@gmail.com', '09123123123', '/uploads/profile_pictures/1764532155528-222919222.jpeg', 'Calape Daanbantayan Cebu', 'IV', 'VII', 'Male', '2003-09-22', 'Cebu City', 'Filipino', 'Catholic', 'Single', 'Romeo M. Tuico Jr.', 'N/A', NULL, 'Flordeliza V. Tuico', 'N/A', NULL, NULL, NULL, NULL, NULL, '$2b$10$u0ZLx5fo6hbQLdHETk9x.OIaBMTWOv0vWfipZBlVc13E1le6mj5Nu', 1, 4, 'A', 'Irregular', 1, 1),
(8221381, 'Syrus', 'D', 'Tuico', NULL, NULL, NULL, 'Bateria, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8221415, 'Kerstine Mae ', 'M.', ' Rodrigo', 'kerstinemaerodrigo@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'C', 'Regular', 0, 0),
(8221425, 'Judy Ann ', 'P.', ' Diaga', 'judyannpanay20@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8221459, 'Dember', 'M', 'Pepito', NULL, NULL, NULL, 'Maya, Daanbantayan, Cebu', 'IV', 'VII', 'Male', NULL, 'Daanbantayan, Cebu', 'Filipino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8223052, 'Restie ', 'D. ', 'Moralde ', 'restiemoralde59@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230529, 'Jhemarsh Lee ', 'V. ', 'Conde', 'condemarshlee07@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230533, 'Elijah Gleen', NULL, 'Tugad', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8230537, 'Zea Marae ', 'Y.', ' Ramil', 'zearamil9@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230546, 'Rheina', ' C. ', 'Ompoy', '   	 rheinaompoy@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230577, 'Bea', NULL, 'Delos Santos', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230582, 'Romel', NULL, 'Batusbatusan', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230586, 'Lourence', ' A. ', 'Zambas', 'lawkun559@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230604, 'Reyvehn ', 'A. ', 'Nulla', 'reyvehnalegado@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230611, 'Kenneth Brian', ' B. ', 'Tangkay', 'tangkaykennethbrian@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230623, 'Monick ', NULL, 'Cabagte', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8230647, 'Kier Louie', NULL, 'Arriesgado', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8230992, 'Mary Janua', '', 'Melendres', 'melendresmaryjanua@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8231801, 'Ezra ', 'M. ', 'Baguhin', 'ezzrabaguhin@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231806, 'Airies Catherine ', 'C. ', 'Batistin', 'airiescatherineb@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231816, 'Rich Lean Drew ', 'M. ', 'Casiano', 'richmandawecasiano@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231818, 'CARL HONMAR ', 'D. ', 'CONDE', 'diamoscarl@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231827, 'Jared', ' M. ', 'Cuerbo', 'jaredcuerbo2004@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231840, 'Justin ', NULL, 'Dumon', 'justindumon123@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8231841, 'Fernandez Ivan ', NULL, '', 'navifernandaz@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 4, 'A', 'Regular', 0, 0),
(8231849, 'John Kyle ', NULL, 'Perez', 'johnkyleperez26@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231852, 'Mary Sheen ', 'A.', ' Punay', 'marysheenpunay@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231860, 'Roi Veinze ', 'A. ', 'Tolin', 'hnbhnz@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'B', 'Regular', 0, 0),
(8231901, 'Fanny Rose', NULL, 'Caballes', '', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Regular', 0, 0),
(8231903, 'Kirt Irah ', 'M. ', 'Fernandez', 'kirtirahfernandez@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 3, 'A', 'Irregular', 0, 0),
(8240024, 'Glorifel', '', 'Dungog', 'breakzpatalita900@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240142, 'Rhey Jay', '', 'Rivera', 'rheyjayrivera9@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240144, 'Sheena Marie', '', 'Gomez', 'sheenamariegomez8@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240153, 'Arzl Anne', 'V.', 'Begaso', 'arzlanne@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240242, 'Rocelle', ' B. ', 'Malamdag ', 'rocellemalamdag01@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240258, 'Alnisa Jean', '', 'Besin', 'alnisajean12@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240263, 'Donna', '', 'Villarin', 'donnavillarin49@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240287, 'Merry Angelica', '', 'Nugas', 'angelicanugas5@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240289, 'Sherlyn ', 'L. ', 'Rohrer', 'rohrerz090844339@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240310, 'Ma. Leizl', 'E.', 'Peras', 'maleizlperas@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240318, 'Benjamin Joshua', 'J.', 'Tecson', 'benjaminjoshuatecson@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240354, 'Kyra joy ', 'L.', ' Teg-an ', 'kyrajoytegan@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Irregular', 0, 0),
(8240376, 'Elaisa ', 'A. ', 'Baquir', 'elaisaalmerolbaquir19@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240380, 'Louie Jay', '', 'Meñoza', 'louiejaymenoza51@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240385, 'Clark James ', 'G. ', 'Yaun', 'clarkjamesyaun@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$.t8GDslmzlt7sDfJdLBfi.86ivDcTOLlEzkyGlALnPkI4IhcIXeuS', 1, 2, 'B', 'Regular', 1, 0),
(8240426, 'Cedric', ' C. ', 'Siazar', 'cedricsiazar57@gmail.com', '09606993025', NULL, 'Purok Makiangayon, Pangunawan, Medellin, Cebu', '4th', '7', 'Male', '2006-05-21', 'Panugnawan', 'Filipino', 'Catholic', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$EDMxCtABw7/cuHOemwnTIe.L1vGNG/gB48iG9sEAc1eQFk/dWNeEy', 1, 2, 'B', 'Regular', 1, 0),
(8240440, 'Honey', '', 'Brigoli', 'brigolihoney26@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240598, 'Cindy Marie ', 'C.', ' Amaquiton', 'amaquitoncindymarie@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240604, 'Megan', 'F.', 'Dinoy', 'dinoymegan40@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240605, 'Ellen Shanaia ', 'Y. ', 'Dinoy', 'dinoyellenshanaia@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240637, 'Jea ', 'M. ', 'Diaz', 'diazjea3@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240655, 'Friendly', '', 'Punay', 'punayfrndly@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240691, 'Michaela', '', 'Saraga', 'michaelasaraga17@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240736, 'Catherine', ' Y. ', 'Jurado', 'catherinejurado8@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240758, 'Elven', 'B.', 'Amarilla', 'amarillaelven20@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240779, 'Princess Shakira', '', 'Arriesgado', 'kira2shaoie@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240824, 'Lou Marie ', NULL, 'Tamboboy', 'loumarietamboboy1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240827, 'Christopher Dave ', 'M. ', 'Roda ', 'christopherdaveroda@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240828, 'Najib', '', 'Dimaronsing', 'najibdimaronsing14@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240831, 'Eugenio IV ', 'H. ', 'Milla', 'eugeniohortelanomilla@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240870, 'John Kenneth ', 'D. ', 'Malinao', 'kenmalinao2020@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240899, 'Donnabel ', 'J. ', 'Beraces', 'doonaberaces@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240903, 'Clive', '', 'Godinez', 'sonclive08@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240905, 'Lhea', 'B.', 'Godines', 'godineslhea@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240907, 'Bryle Adam', '', 'Jumao-as', 'jumaoasbryleadam@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240908, 'Wynn James', '', 'Manzanares', 'manzanareswynnjames@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240909, 'Lyra Mae', ' R. ', 'Bersales', 'bersaleslyramae01@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240910, 'Stiffany Rose  ', 'T.', 'Placencia', 'stiffanyroseplacencia23@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240929, 'Shein ', NULL, 'Godinez', 'sheingondinez7@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240934, 'Lorence ', NULL, 'Inot', 'lorenceino109@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8240949, 'Lovehille Adrhe', 'A.', 'Obial', 'obiallovehille@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8240984, 'Farrah Jane ', 'D. ', 'Ando', 'farrahjanediazando@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8240999, 'Reinze Mahr ', 'M. ', 'Sinangote ', 'reinzemahrsinangote@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8241072, 'En-Jean ', 'J. ', 'Sinangote ', 'enjeansinangote2006@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8241092, 'Mario ', 'P. ', 'Arreglo', 'arreglomario74@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8241137, 'Fati', 'E.', 'Godinez', 'godinezfati658@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8241138, ' Ian Elfred ', 'L. ', 'Maquilan', 'ianelfredmaquilan@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8241149, 'Ashton Jhuroid R. ', 'R. ', 'Notarte', 'ashroidjhuroid@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'A', 'Regular', 0, 0),
(8241160, 'Marjohn', '', 'Garrido', 'marjohngarrido64@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8241165, 'Mary Rose ', 'O. ', 'Villanca ', 'mariarosavillanca@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8241193, 'Angel Pearl', '', 'Macahis', 'angelpearlmacahis187@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8241216, 'Jim Carlo ', 'D. ', 'Maru', 'jimcarlomaru150@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8241339, 'Renalyn ', 'S. ', 'Jalipa', 'jaliparenalyn94@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'C', 'Regular', 0, 0),
(8242453, 'James Keith ', 'Casinillo ', 'Yap', 'keithyap0720@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 2, 'B', 'Regular', 0, 0),
(8250238, 'Anna Mae ', 'D. ', 'Pelayo', 'annamaebunog09@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8250423, 'Grant Gabriel', '', 'Mahilum', 'grantgabrielmahilum97@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250430, 'Reanne ', 'C.', ' Bantiles ', 'reanne.batiles12@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8250438, 'Janine', '', 'Yuson', 'janineyuson54@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250486, 'Julienne ', 'C. ', 'Rodriguez', 'juliennerodriguez1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8250509, 'Jhelian Bryle', 'D.', 'Doble', 'jheliandoble@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250510, 'Rhodora Sophia', 'Pepito', '', 'saliviarhodorasophia@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250525, 'Elaiza Joyce', 'A.', 'Cuyos', 'azailejoyce927@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250533, 'Ansherina', 'O.', 'Mercader', 'mercaderansherina2@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250557, 'Rosaden', 'M.', 'Borres', 'borresrose60@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0);
INSERT INTO `students` (`student_id`, `first_name`, `middle_name`, `last_name`, `email`, `contact_number`, `profile_picture`, `permanent_address`, `congressional_district`, `region`, `gender`, `birth_date`, `birthplace`, `citizenship`, `religion`, `civil_status`, `father_name`, `father_occupation`, `father_contact`, `mother_name`, `mother_occupation`, `mother_contact`, `guardian_name`, `guardian_relationship`, `guardian_contact`, `guardian_email`, `password`, `program_id`, `year_level`, `section`, `student_status`, `is_approved`, `is_enrolled`) VALUES
(8250603, 'Denise Charly', 'E.', 'Coyoca', 'escardadenise@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250622, 'Brittany', 'T.', 'Almonacid', 'almonacidbrittany@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250629, 'Mary Ericka', 'M.', 'Inot', 'inotmaryerickam@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250657, 'Julius Jay ', 'B.', 'Opon', 'juliusopon89@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8250701, 'Jashly Sheary', 'P.', 'Ybañez', 'ybanezjashlysheary@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250723, 'Charmel', 'C.', 'Dela Cruz', 'delacruzcharmel185@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250755, 'Rosabel', '', 'Arregrado', 'rosabelolaver611@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250757, 'Hershey Antonette', 'Yang', 'Nuñez', 'hershyyang@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250771, 'Melz Maureen', 'C.', 'Pepito', 'maureenpepito20@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250774, 'Jamaica', 'P.', 'Manatad', 'manatadjamaica1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250776, 'Decemae', 'M.', 'Edar', 'decemaemarro09@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250806, 'Jerol Anthony', 'G.', 'Bohol', 'jerolanthonybohol@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250807, 'Cristenlyn', '', 'Rapayla', 'cristenlynlucherapayla@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250844, 'Shiela ', 'N. ', 'Tumayao ', 'shielatumayao25@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8250847, 'Judy Rose', 'A.', 'Dugho', 'judyrosedugho@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250851, 'Warren Jay', 'O.', 'Sabuero', 'warrensabuero07@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250856, 'Eduardo', 'I.', 'Vargas Jr.', 'eduardovargas4109@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250858, 'CJ Glenz', '', 'Gulfan', 'reparityparrot@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250860, 'Jerald', 'L.', 'Balansag', 'hepticce@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250923, 'Mary Joy', 'P.', 'Demiar', 'maryjoydemiar684@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250931, 'Althea Jean', 'T.', 'Lequin', 'turnoalthea1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250932, 'Chrislee', 'A.', 'Gallardo', 'gallardochrislee@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250962, 'Kent Lawrence', '', 'Aragon', 'kentlawrencearagon@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250974, 'Mark John', '', 'Tayo', 'markjohntayo1@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8250984, 'Jaylou', 'C.', 'Garcia', 'garciajaylou02@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8250999, 'Lovely', 'Ygot', 'Nudalo', 'lovelynudalo84@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251023, 'Kirk', '', 'Delos Angeles', 'Kirkdelosangeles64@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251034, 'Aina', 'E.', 'Montana', 'ainamontana672@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251036, 'Rica Jane', 'C.', 'Broñola', 'ricajanebronola18@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251047, 'Dia Antoniette', 'P.', 'Narandan', 'ndiaantonniette@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251060, 'Marissa', 'E.', 'Mandawe', 'marissamandawe15@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251138, 'Stephen Jayd', '', 'Estomago', 'estomagostephen5@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251141, 'Abegail', 'J.', 'Ruelez', 'abegailruelez@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251144, 'Eric Cryzlher', 'D.', 'Lastimado', 'cryzlher22@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251150, 'Nache Jr.', 'M.', 'Mantos', 'nachemantos5@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251158, 'Jesryl', 'A.', 'Igot', 'igotjesryl7@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251188, 'Althea Jean', 'O.', 'Fernandez', 'altheaofernandez@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251199, 'James Lloyd', 'M.', 'Ruiz', 'ruizjameslloyd379@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251218, 'Carl Vincent', 'M.', 'Vidal', 'carlvidal367@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251220, 'Maychie', 'B.', 'Dejito', 'maychiebaguiodejito@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251228, 'Rico', 'A.', 'Argallon', 'ricoargallon10@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251245, 'Bea', 'R.', 'Rodrigo', 'rodrigobea38@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251261, 'Prince Dio', 'G.', 'Conde', 'princedioconde@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251308, 'Rosevil ', 'D. ', 'Jovellar ', 'roseviljovellar4@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8251327, 'Isabel', '', 'Cañete', 'izabelcanete9@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251387, 'Lyka Mae', 'Y.', 'Rodrigo', 'lykarodrigo12@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251506, 'Air Frances', 'A.', 'Aguilar', 'francisaguilar069@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8251517, 'Jacob ', 'T. ', 'Lequigan', 'coblequigan@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'A', 'Regular', 0, 0),
(8251534, 'Troy Dynelle', 'S.', 'Castro', 'troydynellecastro@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8251834, 'Van Don', 'R.', 'Batac', 'vandonbatac0@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8252083, 'Kim Harvey', 'M.', 'Conje', 'kim.conje@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8252244, 'Michelle', NULL, ' Togado', 'togadoaldrin@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8252955, 'Nashriel', 'P.', 'Saplad', 'sapladnash0@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8252961, 'Kieth Christian', '', 'Amoroto', 'kiethchristianamoroto68@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'C', 'Regular', 0, 0),
(8252978, 'Rhien Dave', 'A.', 'Patalita', 'rhiendavegwapo@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'D', 'Regular', 0, 0),
(8252983, 'John', 'M', 'Doe', 'johndoe@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'B', 'Regular', 0, 0),
(8252984, 'Jake', 'V', 'Tom', 'jake@gmail.com', NULL, NULL, NULL, NULL, NULL, 'Male', NULL, NULL, NULL, NULL, 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle', 1, 1, 'B', 'Regular', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_section` varchar(255) DEFAULT NULL,
  `subject_code` varchar(20) NOT NULL,
  `subject_desc` text DEFAULT NULL,
  `units` decimal(3,1) NOT NULL DEFAULT 0.0,
  `lec_hours` int(11) NOT NULL DEFAULT 0,
  `lab_hours` int(11) NOT NULL DEFAULT 0,
  `year_level` int(11) NOT NULL,
  `semester` enum('1st','2nd','Summer') NOT NULL,
  `program_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_section`, `subject_code`, `subject_desc`, `units`, `lec_hours`, `lab_hours`, `year_level`, `semester`, `program_id`, `created_at`, `updated_at`) VALUES
(1, 'CO191', 'GEC-RPH', 'READINGS IN PHILIPPINE HISTORY', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(2, 'CO192', 'GEC-MMW', 'MATHEMATICS IN THE MODERN WORLD', 3.0, 3, 0, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(3, 'CO193', 'GEE-TEM', 'THE ENTREPRENEURIAL MIND', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(4, 'CO194', 'CC 111', 'INTRODUCTION TO COMPUTING', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 06:53:49'),
(5, 'CO195', 'CC 112', 'COMPUTER PROGRAMMING 1 (LEC)', 2.0, 2, 0, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(6, 'CO196', 'CC 112L', 'COMPUTER PROGRAMMING 1 (LAB)', 3.0, 0, 3, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(7, 'CO197', 'AP 1', 'MULTIMEDIA', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(8, 'CO198', 'PE 1', 'PHYSICAL EDUCATION', 2.0, 2, 0, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(9, 'CO199', 'NSTP 1', 'NATIONAL SERVICE TRAINING PROGRAM', 3.0, 2, 1, 1, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(10, 'C032', 'GEC-PC', 'PURPOSIVE COMMUNICATION', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(11, 'C033', 'GEC-STS', 'SCIENCE, TECHNOLOGY AND SOCIETY', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(12, 'C034', 'GEC-US', 'UNDERSTANDING THE SELF', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(13, 'C035', 'GEE-GSPS', 'GENDER AND SOCIETY WITH PEACE STUDIES', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(14, 'C036', 'CC 123', 'COMPUTER PROGRAMMING 2 (LEC)', 2.0, 2, 0, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 07:04:11'),
(15, 'C037', 'CC 123L', 'COMPUTER PROGRAMMING 2 (LAB)', 3.0, 0, 3, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 07:07:06'),
(16, 'C038', 'PC 121', 'DISCRETE MATHEMATICS', 3.0, 3, 0, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 07:09:56'),
(17, 'C039', 'AP 2', 'DIGITAL LOGIC DESIGN', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 07:07:31'),
(18, 'C040', 'PATHFIT 2', 'PHYSICAL ACTIVITIES TOWARDS HEALTH AND', 2.0, 2, 0, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(19, 'C041', 'NSTP 2', 'NATIONAL SERVICE TRAINING PROGRAM 2', 3.0, 2, 1, 1, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 07:07:42'),
(20, 'CO356', 'GEC-E', 'ETHICS', 3.0, 3, 0, 2, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(21, 'CO357', 'GEE-ES', 'ENVIRONMENTAL SCIENCE', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(22, 'CO358', 'GEC-LWR', 'LIFE AND WORKS OF RIZAL', 3.0, 3, 0, 2, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(23, 'CO359', 'PC 212', 'QUANTITATIVE METHODS (MODELING & SIMULATION)', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 07:10:45'),
(24, 'CO360', 'CC 214', 'DATA STRUCTURES AND ALGORITHMS (LEC)', 2.0, 2, 0, 2, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 07:10:54'),
(25, 'CO361', 'CC 214L', 'DATA STRUCTURES AND ALGORITHMS (LAB)', 3.0, 0, 3, 2, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 07:11:00'),
(26, 'CO362', 'P Elec 1', 'OBJECT ORIENTED PROGRAMMING', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 07:11:13'),
(27, 'CO363', 'P Elec 2', 'WEB SYSTEMS AND TECHNOLOGIES', 3.0, 2, 1, 2, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 07:11:35'),
(28, 'CO364', 'PE 3', 'PHYSICAL EDUCATION 3', 2.0, 2, 0, 2, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(29, 'C070', 'GEC-TCW', 'THE CONTEMPORARY WORLD', 3.0, 3, 0, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(30, 'C071', 'PC 223', 'INTEGRATIVE PROGRAMMING AND TECHNOLOGIES 1', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:05:07'),
(31, 'C072', 'PC 224', 'NETWORKING 1', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:05:15'),
(32, 'C073', 'CC 225', 'INFORMATION MANAGEMENT (LEC)', 2.0, 2, 0, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:05:32'),
(33, 'C074', 'CC 225L', 'INFORMATION MANAGEMENT (LAB)', 3.0, 0, 3, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:05:50'),
(34, 'C075', 'P Elec 3', 'PLATFORM TECHNOLOGIES', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 11:20:54'),
(35, 'C076', 'AP 3', 'ASP.NET', 3.0, 2, 1, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:06:05'),
(36, 'C077', 'PATHFIT4', 'PHYSICAL ACTIVITIES TOWARDS HEALTH AND', 2.0, 2, 0, 2, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(37, 'CO152', 'GEE-FE', 'FUNCTIONAL ENGLISH', 3.0, 3, 0, 3, '1st', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(38, 'CO153', 'PC 315', 'NETWORKING 2 (LEC)', 2.0, 2, 0, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:07:13'),
(39, 'CO154', 'PC 315L', 'NETWORKING 2 (LAB)', 3.0, 0, 3, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:07:22'),
(40, 'CO155', 'PC 316', 'SYSTEMS INTEGRATION AND ARCHITECTURE 1', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:07:30'),
(41, 'CO156', 'PC 317', 'INTRODUCTION TO HUMAN COMPUTER INTERACTION', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:07:44'),
(42, 'CO157', 'PC 3180', 'DATABASE MANAGEMENT SYSTEMS', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:08:03'),
(43, 'CO158', 'CC 316', 'APPLICATIONS DEVELOPMENT AND EMERGING TECHNOLOGIES', 3.0, 2, 1, 3, '1st', 1, '2025-10-25 04:59:01', '2025-11-26 08:08:22'),
(44, 'C078', 'GEC-AA', 'ART APPRECIATION', 3.0, 3, 0, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(45, 'C079', 'GEE-PEE', 'PEOPLE AND THE EARTH\'S ECOSYSTEMS', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(46, 'C080', 'PC 329', 'CAPSTONE PROJECT AND RESEARCH 1', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 11:21:25'),
(47, 'C081', 'PC 3210', 'SOCIAL AND PROFESSIONAL ISSUES', 3.0, 3, 0, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-10-25 04:59:01'),
(48, 'C082', 'PC 3211', 'INFORMATION ASSURANCE AND SECURITY 1 (LEC)', 2.0, 2, 0, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:08:42'),
(49, 'C083', 'PC 3211L', 'INFORMATION ASSURANCE AND SECURITY 1 (LAB)', 3.0, 0, 3, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:08:57'),
(50, 'COB4', 'AP 4', 'IOS MOBILE APPLICATION DEVELOPMENT', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:09:14'),
(51, 'C085', 'AP 5', 'TECHNOLOGY AND THE APPLICATION OF THE', 3.0, 2, 1, 3, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 08:09:04'),
(52, 'CO159', 'PC 4112', 'INFORMATION ASSURANCE AND SECURITY 2 (LEC)', 2.0, 2, 0, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:31:32'),
(53, 'CO160', 'PC 4112L', 'INFORMATION ASSURANCE AND SECURITY 2 (LAB)', 3.0, 0, 9, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:31:17'),
(54, 'CO161', 'PC 4113', 'SYSTEMS ADMINISTRATION AND MAINTENANCE', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:31:42'),
(55, 'CO162', 'PC 4114', 'CAPSTONE PROJECT AND RESEARCH 3', 3.0, 3, 0, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:31:52'),
(56, 'CO163', 'P Elec 4', 'SYSTE INFORMATION AND ARCHITECTURE 2', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:32:02'),
(57, 'CO164', 'AP 6', 'CROSS-PLATFORM SCRIPT DEVELOPMENT TECHNOLOGY', 3.0, 2, 3, 4, '1st', 1, '2025-11-26 08:18:02', '2025-11-26 08:32:17'),
(58, 'C0110', 'PC 4215', 'ON-THE-JOB-TRAINING (OJT)', 9.0, 0, 0, 4, '2nd', 1, '2025-10-25 04:59:01', '2025-11-26 11:21:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_history`
--
ALTER TABLE `academic_history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `academic_year_standing`
--
ALTER TABLE `academic_year_standing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `authentication_logs`
--
ALTER TABLE `authentication_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `educational_background`
--
ALTER TABLE `educational_background`
  ADD PRIMARY KEY (`edu_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`);

--
-- Indexes for table `enrollment_subjects`
--
ALTER TABLE `enrollment_subjects`
  ADD PRIMARY KEY (`enrollment_id`,`subject_section`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`faculty_id`);

--
-- Indexes for table `faculty_subjects`
--
ALTER TABLE `faculty_subjects`
  ADD PRIMARY KEY (`faculty_subject_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `prerequisites`
--
ALTER TABLE `prerequisites`
  ADD PRIMARY KEY (`prerequisite_id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_history`
--
ALTER TABLE `academic_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=438;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123127;

--
-- AUTO_INCREMENT for table `faculty_subjects`
--
ALTER TABLE `faculty_subjects`
  MODIFY `faculty_subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `prerequisites`
--
ALTER TABLE `prerequisites`
  MODIFY `prerequisite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8252985;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
