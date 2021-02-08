import "antd/dist/antd.css";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import { Layout, Menu, Row, Col } from "antd";
import { getBestAnchorGivenScrollLocation } from "./libs/scroll";

const { Header, Content, Footer } = Layout;

function App() {
  const sections = useRef();
  const [currentAnchor, setCurrentAnchor] = useState("section1");
  const handleScroll = () => {
    let anchor = getBestAnchorGivenScrollLocation(sections.current, 0);
    if (anchor === undefined) anchor = "section1";
    if (anchor !== currentAnchor) setCurrentAnchor(anchor);
  };
  useEffect(() => {
    sections.current = {
      section1: document.getElementById("section1"),
      section2: document.getElementById("section2"),
      section3: document.getElementById("section3"),
      section4: document.getElementById("section4"),
      section5: document.getElementById("section5"),
      section6: document.getElementById("section6"),
    };
    document.addEventListener("scroll", handleScroll);
  });

  return (
    <div className="App">
      <Layout>
        <Header>
          <div>
            <img src="/logo.svg" className="App-logo" alt="logo" />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["section1"]}
            selectedKeys={[currentAnchor]}
          >
            <Menu.Item key="section1">
              <a href="#section1">Section 1</a>
            </Menu.Item>
            <Menu.Item key="section2">
              <a href="#section2">Section 2</a>
            </Menu.Item>
            <Menu.Item key="section3">
              <a href="#section3">Section 3</a>
            </Menu.Item>
            <Menu.Item key="section4">
              <a href="#section4">Section 4</a>
            </Menu.Item>
            <Menu.Item key="section5">
              <a href="#section5">Section 5</a>
            </Menu.Item>
            <Menu.Item key="section6">
              <a href="#section6">Section 6</a>
            </Menu.Item>
          </Menu>
        </Header>

        <Content>
          <Row>
            <Col span={16} offset={4}>
              <div className="App-sections" id="section1">
                <h2>Section 1</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quam quisque id diam vel quam elementum. Nec ultrices dui
                  sapien eget mi proin. Auctor urna nunc id cursus metus aliquam
                  eleifend mi. Placerat duis ultricies lacus sed turpis
                  tincidunt. Interdum velit laoreet id donec. Adipiscing
                  bibendum est ultricies integer quis auctor elit sed vulputate.
                  Nisl rhoncus mattis rhoncus urna. Adipiscing vitae proin
                  sagittis nisl. Integer quis auctor elit sed vulputate mi sit
                  amet. Habitant morbi tristique senectus et netus. In egestas
                  erat imperdiet sed euismod nisi. Ultrices vitae auctor eu
                  augue ut lectus arcu. Platea dictumst vestibulum rhoncus est
                  pellentesque elit. Lobortis feugiat vivamus at augue eget arcu
                  dictum. Diam sollicitudin tempor id eu nisl nunc mi ipsum
                  faucibus.
                </p>
                <p>
                  Neque convallis a cras semper. Tempor orci eu lobortis
                  elementum nibh tellus molestie nunc non. Amet nulla facilisi
                  morbi tempus iaculis urna id volutpat lacus. Imperdiet massa
                  tincidunt nunc pulvinar. Amet nisl suscipit adipiscing
                  bibendum est ultricies. Vitae semper quis lectus nulla at. Leo
                  vel orci porta non pulvinar neque laoreet. Augue interdum
                  velit euismod in. Neque viverra justo nec ultrices dui sapien
                  eget mi proin. Ultrices neque ornare aenean euismod elementum
                  nisi quis eleifend quam. Parturient montes nascetur ridiculus
                  mus mauris vitae. Tortor at auctor urna nunc id cursus metus
                  aliquam eleifend. In eu mi bibendum neque egestas congue
                  quisque. Malesuada proin libero nunc consequat interdum
                  varius. Gravida cum sociis natoque penatibus et magnis dis
                  parturient. Dui vivamus arcu felis bibendum ut tristique et
                  egestas quis.
                </p>
              </div>
              <div className="App-sections" id="section2">
                <h2>Section 2</h2>
                <p>
                  Praesent elementum facilisis leo vel fringilla est
                  ullamcorper. Sit amet consectetur adipiscing elit. Consequat
                  nisl vel pretium lectus quam id leo. Lorem donec massa sapien
                  faucibus. Egestas sed tempus urna et pharetra pharetra massa.
                  Facilisi nullam vehicula ipsum a arcu cursus vitae congue.
                  Dolor magna eget est lorem ipsum dolor sit. Urna nec tincidunt
                  praesent semper. Amet justo donec enim diam vulputate. Lacinia
                  at quis risus sed vulputate odio. Tellus elementum sagittis
                  vitae et leo duis. Justo donec enim diam vulputate ut pharetra
                  sit. Pretium viverra suspendisse potenti nullam ac tortor.
                  Hendrerit dolor magna eget est. Habitant morbi tristique
                  senectus et netus et malesuada.
                </p>
                <p>
                  Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu.
                  Lobortis feugiat vivamus at augue eget arcu. Commodo viverra
                  maecenas accumsan lacus. Viverra ipsum nunc aliquet bibendum
                  enim facilisis gravida. Risus sed vulputate odio ut enim
                  blandit volutpat. Dapibus ultrices in iaculis nunc sed.
                  Quisque non tellus orci ac auctor augue. Etiam non quam lacus
                  suspendisse faucibus. Amet mauris commodo quis imperdiet massa
                  tincidunt nunc pulvinar. Ac feugiat sed lectus vestibulum
                  mattis ullamcorper velit sed ullamcorper. Ullamcorper velit
                  sed ullamcorper morbi tincidunt ornare. Mattis rhoncus urna
                  neque viverra. Porta non pulvinar neque laoreet suspendisse
                  interdum consectetur. Malesuada proin libero nunc consequat.
                  Tortor aliquam nulla facilisi cras fermentum odio eu. Nulla at
                  volutpat diam ut venenatis tellus in metus vulputate.
                  Suspendisse sed nisi lacus sed viverra tellus. Tellus molestie
                  nunc non blandit massa enim. At quis risus sed vulputate odio.
                  Est ante in nibh mauris cursus.
                </p>
              </div>
              <div className="App-sections" id="section3">
                <h2>Section 3</h2>
                <p>
                  Ornare suspendisse sed nisi lacus. Sapien eget mi proin sed
                  libero enim. Ornare arcu dui vivamus arcu felis. Odio tempor
                  orci dapibus ultrices in iaculis nunc sed. Interdum posuere
                  lorem ipsum dolor. Nulla aliquet enim tortor at auctor.
                  Eleifend mi in nulla posuere sollicitudin aliquam. Non blandit
                  massa enim nec dui nunc mattis enim ut. Accumsan tortor
                  posuere ac ut. Ut venenatis tellus in metus vulputate eu
                  scelerisque. Etiam erat velit scelerisque in dictum. Turpis in
                  eu mi bibendum neque egestas. Non consectetur a erat nam at
                  lectus.
                </p>
                <p>
                  Mauris rhoncus aenean vel elit scelerisque mauris
                  pellentesque. Amet volutpat consequat mauris nunc congue.
                  Elementum tempus egestas sed sed risus pretium. Porttitor eget
                  dolor morbi non arcu. Nec tincidunt praesent semper feugiat
                  nibh sed pulvinar proin. Facilisis mauris sit amet massa vitae
                  tortor condimentum. Maecenas sed enim ut sem viverra aliquet.
                  Mattis vulputate enim nulla aliquet porttitor lacus luctus
                  accumsan tortor. Tincidunt ornare massa eget egestas purus
                  viverra accumsan. Amet nisl purus in mollis nunc sed id
                  semper. Sit amet facilisis magna etiam. In fermentum posuere
                  urna nec. Porttitor massa id neque aliquam vestibulum morbi
                  blandit. Libero nunc consequat interdum varius sit. Facilisis
                  gravida neque convallis a cras semper auctor neque vitae.
                </p>
              </div>
              <div className="App-sections" id="section4">
                <h2>Section 4</h2>
                <p>
                  Arcu ac tortor dignissim convallis. Integer feugiat
                  scelerisque varius morbi enim. Ut ornare lectus sit amet est
                  placerat in. Orci ac auctor augue mauris augue neque. Commodo
                  elit at imperdiet dui accumsan. Sagittis vitae et leo duis ut.
                  Malesuada fames ac turpis egestas integer eget aliquet.
                  Malesuada fames ac turpis egestas integer eget. Et odio
                  pellentesque diam volutpat commodo. Convallis a cras semper
                  auctor. Ipsum consequat nisl vel pretium lectus quam. Erat
                  imperdiet sed euismod nisi porta lorem. Dolor magna eget est
                  lorem ipsum dolor sit amet consectetur. Enim eu turpis egestas
                  pretium aenean pharetra. Quis auctor elit sed vulputate mi sit
                  amet. At elementum eu facilisis sed odio morbi quis commodo
                  odio.
                </p>
                <p>
                  Dapibus ultrices in iaculis nunc sed augue lacus viverra. Nec
                  sagittis aliquam malesuada bibendum arcu vitae elementum
                  curabitur vitae. Tristique magna sit amet purus gravida quis
                  blandit turpis cursus. Risus ultricies tristique nulla aliquet
                  enim. Molestie a iaculis at erat pellentesque. Pharetra massa
                  massa ultricies mi quis. Lacus luctus accumsan tortor posuere
                  ac. In fermentum posuere urna nec tincidunt praesent semper
                  feugiat nibh. Est ultricies integer quis auctor elit sed.
                  Lectus nulla at volutpat diam ut venenatis tellus in metus.
                </p>
              </div>
              <div className="App-sections" id="section5">
                <h2>Section 5</h2>
                <p>
                  Sit amet dictum sit amet. Aliquam sem et tortor consequat id.
                  Sagittis vitae et leo duis ut diam. Nunc aliquet bibendum enim
                  facilisis gravida. Odio ut enim blandit volutpat maecenas
                  volutpat blandit. Fermentum dui faucibus in ornare quam
                  viverra. Libero enim sed faucibus turpis. Sed egestas egestas
                  fringilla phasellus faucibus scelerisque eleifend donec. Sed
                  augue lacus viverra vitae. Nunc mattis enim ut tellus
                  elementum. Volutpat odio facilisis mauris sit amet massa
                  vitae. Lorem mollis aliquam ut porttitor leo. Tortor at risus
                  viverra adipiscing at in tellus integer feugiat. Pharetra
                  convallis posuere morbi leo urna molestie at elementum. Vel
                  turpis nunc eget lorem. Vulputate odio ut enim blandit
                  volutpat. Id venenatis a condimentum vitae sapien. Metus
                  aliquam eleifend mi in nulla posuere. Placerat duis ultricies
                  lacus sed. Tortor at auctor urna nunc id.
                </p>
                <p>
                  Ornare lectus sit amet est placerat in egestas erat imperdiet.
                  Fringilla ut morbi tincidunt augue interdum velit euismod in.
                  Ac turpis egestas maecenas pharetra. Risus sed vulputate odio
                  ut enim blandit volutpat maecenas. Ultrices neque ornare
                  aenean euismod elementum nisi quis eleifend. Quam vulputate
                  dignissim suspendisse in est. Enim nulla aliquet porttitor
                  lacus luctus accumsan tortor posuere. Sit amet consectetur
                  adipiscing elit pellentesque habitant. Enim blandit volutpat
                  maecenas volutpat blandit aliquam etiam. Felis bibendum ut
                  tristique et. Eleifend quam adipiscing vitae proin sagittis
                  nisl rhoncus. Platea dictumst vestibulum rhoncus est
                  pellentesque elit ullamcorper dignissim. Odio ut sem nulla
                  pharetra diam sit amet nisl suscipit. Nibh mauris cursus
                  mattis molestie a iaculis at erat. Nec ultrices dui sapien
                  eget mi proin sed libero.
                </p>
              </div>
              <div className="App-sections" id="section6">
                <h2>Section 6</h2>
                <p>
                  Vulputate enim nulla aliquet porttitor lacus luctus accumsan
                  tortor posuere. Semper auctor neque vitae tempus quam.
                  Dignissim diam quis enim lobortis scelerisque fermentum dui
                  faucibus. Sit amet cursus sit amet dictum. Bibendum ut
                  tristique et egestas quis ipsum suspendisse ultrices gravida.
                  Ipsum a arcu cursus vitae congue mauris rhoncus aenean.
                  Vestibulum mattis ullamcorper velit sed ullamcorper morbi
                  tincidunt. Non quam lacus suspendisse faucibus interdum
                  posuere lorem ipsum. Urna nunc id cursus metus aliquam. Est
                  placerat in egestas erat imperdiet sed. Ut consequat semper
                  viverra nam libero justo. Odio eu feugiat pretium nibh ipsum
                  consequat nisl vel. Facilisis mauris sit amet massa vitae
                  tortor condimentum lacinia.
                </p>
                <p>
                  Fermentum et sollicitudin ac orci phasellus. Non consectetur a
                  erat nam at lectus urna duis. Vulputate sapien nec sagittis
                  aliquam malesuada bibendum arcu. Purus viverra accumsan in
                  nisl nisi scelerisque eu. Dolor sit amet consectetur
                  adipiscing. Integer vitae justo eget magna fermentum. Magna
                  fringilla urna porttitor rhoncus. Molestie at elementum eu
                  facilisis sed odio morbi quis commodo. Mauris nunc congue nisi
                  vitae suscipit tellus mauris a diam. Vel quam elementum
                  pulvinar etiam non quam lacus suspendisse faucibus. Viverra
                  accumsan in nisl nisi. Tellus in hac habitasse platea dictumst
                  vestibulum rhoncus est pellentesque. Neque aliquam vestibulum
                  morbi blandit cursus risus at ultrices.
                </p>
              </div>
            </Col>
          </Row>
        </Content>

        <Footer className="App-footer">
          <div className="App-footer-copyrights">
            @2020 Some rights reserved
          </div>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
