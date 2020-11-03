/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : chainb

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 03/11/2020 20:39:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `private_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `isActivate` int(0) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'testadmin', 'c0ffd5a3d329dd183d52521e76a89c30', 'testadminprivatekey', 1);
INSERT INTO `admin` VALUES (2, 'xwj123', 'ef30d0cf6ce291f6defa9f1d332f71ae', 'xwj123', 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'user',
  `address` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `private_key` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `balance` int(0) NOT NULL DEFAULT 0,
  `create_time` datetime(0) NOT NULL,
  `change_time` datetime(0) NOT NULL,
  `delete_time` datetime(0) NOT NULL,
  `isBlack` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false',
  `isDelete` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false',
  `isActivate` int(0) NOT NULL DEFAULT 0,
  `paycode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 68 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (63, 'testuser', 'b04a7ca45ee3f3afe375161a120f9eaa', 'testuser', 'user', '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQC+B/aBjeS2CILonCLimGew1kzPfxVozL9pl5pFIzEwtU29rw6FEF9pt0dL\ndl6HGFDUGh9shs4QLvteMCG4VYOjAgMBAAE=\n-----END RSA PUBLIC KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAL4H9oGN5LYIguicIuKYZ7DWTM9/FWjMv2mXmkUjMTC1Tb2vDoUQ\nX2m3R0t2XocYUNQaH2yGzhAu+14wIbhVg6MCAwEAAQJBALSBg9nUGqf+tbqWdVyg\nP/5t0VBX+tItirSWWOfLYfJM4MHgfQm9SstUcevW+pHnZYO7p2arQuUkWKEpKkFU\n+kECIQDycifOjYzA7swQTPCiRnSLBNdH36c2bjDED+XXR2SMuQIhAMinp9LqXJD5\nBaTGhn+iIGDY+lIasCVsgMys6lxtKT07AiBjrQswoIF90K+VBAzqqoy/mv3nTsww\nVJ03/lFAcNmmAQIgXby00ftaMv+ie0+jFY0Pwy6aAjEliNYfdX5yHauBUHECIQCx\nzvlU8N9Hu7YLbfPzh/S1r4mPxweCOuWZHHGIpZbWUQ==\n-----END RSA PRIVATE KEY-----', 164, '2020-11-02 13:59:17', '2020-11-02 13:59:17', '2020-11-02 13:59:17', 'false', 'false', 1, NULL);
INSERT INTO `user` VALUES (64, 'testuser1', 'b04a7ca45ee3f3afe375161a120f9eaa', 'testuser1', 'user', '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQDeaQctg76Q9mwRpoLk5f6DKwmPprw9Ug5jiGt6ujDGoTJhU+Qi9uFGSi5t\nyZdpftnOJeFvg3r+DWDlW4Q9JypNAgMBAAE=\n-----END RSA PUBLIC KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAN5pBy2DvpD2bBGmguTl/oMrCY+mvD1SDmOIa3q6MMahMmFT5CL2\n4UZKLm3Jl2l+2c4l4W+Dev4NYOVbhD0nKk0CAwEAAQJBAIFcCSa5588c5MJnXN6R\nvzS/hXIeAoKQBXpy0ECzpsb/yOy9Vs+/3IWTvD+BpQTvsI6uV8mBc/pb3SPMKoof\nyekCIQD8qRNTLKyXwnK9caT3y66eQpbFKpAkNKjXqhxUZ6mrhwIhAOFZmGak390i\n3GmP6K++jkj2EYuRVHE1aemHDFFU0riLAiBZtB2sVhwg9WSPZh3P7Hzeq32kGux6\nLkgT6c2NGhDfWQIhAKHUjbVowbs0xcSpLBjJZ7TNwVvRSiriiOTDrvzZRVpxAiEA\nr2f5ACyCcAk5/P5hLWyQ1KHpqWUd31pWKpQKk8rQsyo=\n-----END RSA PRIVATE KEY-----', 0, '2020-11-02 13:59:34', '2020-11-02 13:59:34', '2020-11-02 13:59:34', 'false', 'false', 1, NULL);
INSERT INTO `user` VALUES (65, 'testuser2', 'b04a7ca45ee3f3afe375161a120f9eaa', 'testuser2', 'user', '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQCVWMGTBie8Z8Jf7EQwQoI53BUcIIXxCYUG6Qeeb7yvfc+buKFqCcupz9xE\nNAxZT/0YqCh7nMRc/zRCQ0ALoelTAgMBAAE=\n-----END RSA PUBLIC KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAJVYwZMGJ7xnwl/sRDBCgjncFRwghfEJhQbpB55vvK99z5u4oWoJ\ny6nP3EQ0DFlP/RioKHucxFz/NEJDQAuh6VMCAwEAAQJAJklPrsJYM3uiH/cw7/JM\n8kpSexh3Xfijysa4tkxM4ewHP0WWCe6+kYpUvkdWjT01j3X6HA9HVF4ldfk3Fea1\nOQIhAPNlEpnmqy8s+YYHggCoY6XIzfH3X0NQ0qgELyQuiKf1AiEAnRTLR4/5Wj9L\nuEdzowC5WGIwlXlirUlYFUTJsIQSJycCIQDRXlVU6/a/Wwm9wIGU/UTSnFyD0w4w\nQrsi6o5+qkTFbQIgZVkBPw7ZZyzngeI37beN3kSb7BUBYaSsvCxBpS3ROIkCIQCb\nD6z1fS2Enk0X0TkfxnBSVBvYhg2zBkkX/pYhpvtacw==\n-----END RSA PRIVATE KEY-----', 0, '2020-11-02 13:59:38', '2020-11-02 13:59:38', '2020-11-02 13:59:38', 'false', 'false', 1, NULL);
INSERT INTO `user` VALUES (66, 'testuser3', 'b04a7ca45ee3f3afe375161a120f9eaa', 'testuser3', 'user', '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQCKff3/NG3ytJkZQ4Bxc42jl3rvwyOazu8GkuC4xD7XguezKaMe1+hHPend\n7uHU98RXRHqJK5jnXumUVZFQd1ddAgMBAAE=\n-----END RSA PUBLIC KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nMIIBOQIBAAJBAIp9/f80bfK0mRlDgHFzjaOXeu/DI5rO7waS4LjEPteC57Mpox7X\n6Ec96d3u4dT3xFdEeokrmOde6ZRVkVB3V10CAwEAAQJASvt6OOGPIdgsCCSm90YE\nCu2qDwRNU7T0b0+4wfDmwVF+gScFwCwg+Ix1DWqWZdP3KmCtiIoY3AN0kO2hbDyA\nFQIhANQSBWS27qyXn5isrjxi6bUej+yuArKvKEzxBgdoZoqPAiEApy4oIEERX/Tt\nW3lqseyLOkxSwIJT2lYNGBuhE7OSZVMCIAi3rO0U7/68RN07y/XDgyPk27m49Xdu\n59Mx3TOUwRJVAiBGZouDOaNlczDZCoJBtsjSnf1jD/7bvMz6z/e+4inN/QIgOdjb\nH+Ug8zqiiikcJD867mADVR2Q56kOmmFtZjS2tP8=\n-----END RSA PRIVATE KEY-----', 0, '2020-11-02 13:59:41', '2020-11-02 13:59:41', '2020-11-02 13:59:41', 'false', 'false', 1, NULL);
INSERT INTO `user` VALUES (67, 'testuser4', 'b04a7ca45ee3f3afe375161a120f9eaa', 'testuser4', 'user', '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQClECP5J2jniF1kIlK88itCS7CSPV2S9lywMof7K0T0WLgaXkF/ejaVBDr7\nT0aNZOSYOahZBM9Y2FVm0R3goRkbAgMBAAE=\n-----END RSA PUBLIC KEY-----', '-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAKUQI/knaOeIXWQiUrzyK0JLsJI9XZL2XLAyh/srRPRYuBpeQX96\nNpUEOvtPRo1k5Jg5qFkEz1jYVWbRHeChGRsCAwEAAQJAJRq3u25Mep+Avt2oU6js\naH6zNmxs+HhA5aq2PpO/cF2UCICdgAo9dDDu1MB8no+i9yq4dsWSV5pUntO36zXI\n4QIhAOhUSQmpSh9imX7V3qsyihf9AaN/wxDBLZIugHDojuOXAiEAteFjcy+Cx6MM\nf5M0qqnP3CClXMBEkzLeMe1PPN7PVx0CIQDY11IUIl18TZrWNudNAi7BlPMiluyJ\nhsPx3FUlDOnQoQIgOSAZhEwf32QuwMMTf6bmSlVWmtMotrL7ZuMKSCwTI2ECIQDn\nt4sCTQCAScsKPuzjj1PZ542l5jHet04jLUPhVyqRkw==\n-----END RSA PRIVATE KEY-----', 193, '2020-11-02 13:59:43', '2020-11-02 13:59:43', '2020-11-02 13:59:43', 'false', 'false', 1, NULL);

SET FOREIGN_KEY_CHECKS = 1;
