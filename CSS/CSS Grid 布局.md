# css Grid 布局

grid 布局可以将网页划分成一个个的网格，flex 布局 是基于轴线的一维布局。grid 布局则是二维布局，可以组合出不同网格实现各种布局。

## 基础概念

1.  容器和项目

    采用网格布局的区域 称为容器（container），容器内部顶层的子元素就是项目（item）。只有顶层的子元素才能是 item。如下更深一层的 p 标签就不算。

    ```html
    <div class="container">
      <div style="background-color: red"><p>1</p></div>
      <div style="background-color: orange"><p>2</p></div>
      <div style="background-color: #ffff00"><p>3</p></div>
      <div style="background-color: #00ff00"><p>4</p></div>
      <div style="background-color: #00ffff"><p>5</p></div>
      <div style="background-color: #0000ff"><p>6</p></div>
      <div style="background-color: black"><p>7</p></div>
      <div style="background-color: wheat"><p>8</p></div>
      <div style="background-color: #cccccc"><p>9</p></div>
    </div>
    ```

2.  行、列

    容器里面水平区域称为行（row），垂直区域称为列（cloumn）。

3.  单元格

    行与列交叉区域，称为单元格（cell）

4.  网格线

    划分网格的线称为网格线（grid line），一般 n 行就有 n+1 根水平网格线， m 列就有 m+1 根网格线。

## 容器属性

Grid 布局属性可以分成两类。一类定义在 容器上， 一类定义在 项目上。

1. display

   指定一个容器采用网格布局，容器元素默认为块级元素，设为行内元素使用 inline-grid 属性。

   ```css
   div {
     display: grid;
   }
   ```

2. grid-template-columns 、grid-template-rows

   用于划分行列，grid-template-columns 指定每一列的列宽，grid-template-rows 指定每行的行高。

   ```css
   .container {
     display: grid;
     grid-template-columns: 100px 100px 100px;
     /* grid-template-columns: 33.3%  33.3%  33.3%;*/
     grid-template-rows: 100px 100px 100px;
   }
   ```

   如上定义了 一个 3x3 的表格， 除了可以用用绝对单位，也可以用百分比。

   - repeat()

     设置重复值时可以使用 repeat()函数进行简化。

     repeat()函数接受两个参数，第一个是重复的次数，第二个参数是重复的值。

     ```css
     .container {
       display: grid;
       grid-template-columns: repeat(3, 100px);
       grid-template-rows: repeat(3, 100px);
     }
     ```

     repeat()函数也可以重复某种模式。

     ```css
     .container {
       display: grid;
       grid-template-columns: repeat(3, 100px 50px);
       grid-template-rows: repeat(3, 100px);
     }
     ```

   - auto-fill 关键字

     如果单元格固定但是容器不固定，每一行尽可能容纳更多单元格，可以使用 auto-fill 关键字表示自动填充

     ```css
     .container {
       display: grid;
       grid-template-columns: repeat(auto-fill, 100px);
       grid-template-rows: repeat(3, 100px);
     }
     ```

   - fr 关键字

     fr（fraction ， 片段）用于表示比例管理关系。

     ```css
     .container {
       display: grid;
       grid-template-columns: 1fr 2fr;
       /*grid-template-columns:  100px 1fr 2fr;*/
     }
     ```

     如上，表示整个容器被分为两列，第二列的宽度是第一列的宽度的两倍。也可以与绝对单位连用，上面表示第一行占用容器 100px，第二、三列占用剩下的宽度，切第三列是第二列的两倍。

   - minmax()

     函数产生一个长度范围，接收两个参数，分别为最小值、最大值。

   - auto 关键字  
      表示让浏览器自己决定长度
     ```css
     .container {
       display: grid;
       grid-template-columns: 100px auto 100px;
     }
     ```
   - 网格线的名称

     在 grid-template-columns 和 grid-template-rows 属性里，可以使用方括号指定每一根网格线的名字，方便后续引用。

     ```css
     .container {
       display: grid;
       grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
       grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
     }
     ```

3. row-gap 属性、column-gap 属性、gap 属性

   row-gap 属性、column-gap 属性分别设置网格的行间距、列间距。gap 属性是他们的合并简写。 `gap: <row-gap> <column-gap>;` 如果只写一个值则认为两个值相同

4. grid-template-areas 属性

   网格布局允许指定区域（areas），一个区域由单个或者多个单元格组成。

   ```css
   .container {
     display: grid;
     grid-template-columns: 100px 100px 100px;
     grid-template-rows: 100px 100px 100px;
     grid-template-areas:
       "a b c"
       "d e f"
       "g h i";
   }
   ```

   如上， 3x3 的网格分成了 9 个区域。

   ```css
   .container {
     display: grid;
     grid-template-columns: 100px 100px 100px;
     grid-template-rows: 100px 100px 100px;
     grid-template-areas:
       "a a a"
       "b b b"
       "c c c";
   }
   ```

   这里， 3x3 的网格分成了 a、b、c 3 个区域。
