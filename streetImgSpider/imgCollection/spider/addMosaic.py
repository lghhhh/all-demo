import sys
import os
import re
import cv2

curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)
# import matplotlib.pyplot as plt

# plt.rcParams['font.sans-serif'] = ['SimHei']  # 显示中文


def masaic(root, filename):
    filePath = os.path.join(root, filename).replace('\\', '/')
    #print('1111',filePath)
    img = cv2.imread(filePath)
    #print(img)
    # img1 =img
    # 抽取Roi兴趣点
    # 相关标示 高度870-905 宽910-1160
    imgROI = img[870:905, 910:1160]
    imgROI1 = img[250:262, 238:278]
    imgROI2 = img[250:262, 750:790]
    imgROI3 = img[250:262, 1262:1302]
    imgROI4 = img[250:262, 1774:1814]
    imgROI5 = img[762:774, 238:278]
    imgROI6 = img[762:774, 750:790]
    imgROI7 = img[762:774, 1262:1302]
    imgROI8 = img[762:774, 1774:1814]
    
    imgRoiBlurry = cv2.blur(imgROI, (40, 40))
    imgROIBlurry1 = cv2.blur(imgROI1, (7, 7))
    imgROIBlurry2 = cv2.blur(imgROI2, (7, 7))
    imgROIBlurry3 = cv2.blur(imgROI3, (7, 7))
    imgROIBlurry4 = cv2.blur(imgROI4, (7, 7))
    imgROIBlurry5 = cv2.blur(imgROI5, (7, 7))
    imgROIBlurry6 = cv2.blur(imgROI6, (7, 7))
    imgROIBlurry7 = cv2.blur(imgROI7, (7, 7))
    imgROIBlurry8 = cv2.blur(imgROI8, (7, 7))
    # plt.subplot(1, 1, 1), plt.imshow(img1)
    # plt.title('模糊前')
    # plt.axis('off')  # 关闭坐标轴  设置为on则表示开启坐标轴
    # plt.show()  # 显示图像

    # plt.subplot(1, 1, 1), plt.imshow(outputimg)
    # plt.title('模糊后')
    # plt.axis('off')  # 关闭坐标轴  设置为on则表示开启坐标轴
    # plt.show()  # 
    # 均值模糊

    # 移植回原有图像
    img[870:905, 910:1160]  = imgRoiBlurry
    img[250:262, 238:278]   = imgROIBlurry1
    img[250:262, 750:790]   = imgROIBlurry2
    img[250:262, 1262:1302] = imgROIBlurry3
    img[250:262, 1774:1814] = imgROIBlurry4
    img[762:774, 238:278]   = imgROIBlurry5
    img[762:774, 750:790]   = imgROIBlurry6
    img[762:774, 1262:1302] = imgROIBlurry7
    img[762:774, 1774:1814] = imgROIBlurry8
    # showimg=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    # plt.subplot(1, 1, 1), plt.imshow(showimg)
    # plt.title('模糊后')
    # plt.axis('off')  # 关闭坐标轴  设置为on则表示开启坐标轴
    # plt.show()  # 

    savePath = root.replace('mergeImg', 'mosaicImg')
    savePathIsAccess=os.access(savePath, os.F_OK)
    if savePathIsAccess==False:
        os.makedirs(savePath,mode=0o777)
    cv2.imwrite((os.path.join(savePath, filename)), img)
    # 将原始图像保存为jpg格式作为已经操作完的标示
    # filename2 =filename.replace('.jpeg', '.jpg')
    # cv2.imwrite((os.path.join(savePath, filename2)), img1)


# ============================================================================================
__dirname = os.path.abspath('.')  # 当前文件夹路径
sourcePath = os.path.join(__dirname, r'mergeImg')
# sourcePath=os.path.join(__dirname,r'spider\util')
print('=======>>>>>>>>>'+sourcePath)
g = os.walk(sourcePath)
for root, dirs, files in g:
    for name in files:
        # # 匹配前视图
        falg = re.search(r'.jpeg$', name, flags=0)
        if falg != None:
            filePtah= os.path.join(root, name)
            print(filePtah)
            masaic(root, name)
            # 将原始图像保存为jpg格式作为已经操作完的标示
            newFilePath=filePtah.replace('.jpeg', '.jpg')
            os.rename(filePtah,newFilePath)
            