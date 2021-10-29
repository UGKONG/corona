import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Styled from 'styled-components';

const App = () => {
  const url = 'https://sanguk-77ee5-default-rtdb.firebaseio.com/corona.json';
  const titles = ['No', '지역', '접촉력', '확진일', '노출여부', '연번', '등록일', '상태', '수정일', '여행력'];
  const props = [
    'corona19_area', 'corona19_contact_history', 'corona19_date', 'corona19_display_yn', 'corona19_id', 
    'corona19_idate', 'corona19_leave_status', 'corona19_mdate', 'corona19_travel_history'
  ];
  const [list, setList] = useState(null);
  const [value, setValue] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    fetch(url).then((res) => res.json()).then(
      ({DATA}) => {
        setList(DATA);
        setLoad(false);
      }
    );
  }, []);

  const changeValue = useCallback((e) => setValue(e.target.value), [setValue]);

  const allCountMemo = useMemo(() => '총 확진자 수: ' + (list?.length ?? 0) + '명', []);

  const titleMemo = useMemo(() => <tr>{ titles.map(title => <th key={ title }>{ title }</th>) }</tr>, []);

  const loadMemo = useMemo(() => <tr><td colSpan={titles.length}>로딩중..</td></tr>, []);

  const listMemo = useMemo(() => (
    list?.map((li, i) => {
      let txt1 = 'corona19_idate';
      let txt2 = 'corona19_mdate';
      let tag = (
        <tr key={i}>
          <td>{i + 1}</td>
          {props.map(
            (prop, ii) => (
              <td key={ii}>
                {
                  prop == txt1 || prop == txt2 ? 
                  li[prop].split(' ')[0] : li[prop] == '구로구' ?
                  <span>{li[prop]}</span> : li[prop]
                }
              </td>
            )
          )}
        </tr>
      );
      let bool = li.corona19_area.search(value) > -1 ? true : false;
      
      if (bool) return tag;
    })
  ), [list, value]);

  return (
    <main>
      <Input onChange={ changeValue } placeholder="검색어를 입력하세요. (지역 검색)" />
      <small>{ allCountMemo }</small>
      <Table>
        <thead>{ titleMemo }</thead>
        <tbody>{ load ? loadMemo : listMemo }</tbody>
      </Table>
    </main>
  );
}

export default App;

const Table = Styled.table`
  border-collapse: collapse;
  width: 100%;
  
  th, td {
    border: 1px solid #aaa;
    padding: 4px 14px;
    text-align: center;

    span {
      color: #f00;
    }
  }
`;

const Input = Styled.input`
  width: 100%;
  height: 30px;
  border: 1px solid #aaa;
  border-left: 0;
  border-right: 0;
  padding: 0 6px;
`;