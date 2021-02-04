import os
import cv2



def masaic(root,filename)
    savePath=root.replace('mergeImg','mosaicImg')
# ============================================================================================
__dirname=os.path.abspath('.')  #当前文件夹路径
sourcePath=os.path.join(__dirname,'spider\mergeImg')
# sourcePath=os.path.join(__dirname,r'spider\util')
print('=======>>>>>>>>>'+sourcePath)
g = os.walk(sourcePath) 
for root, dirs, files in g :
    for name in files:
        print(os.path.join(root, name))



