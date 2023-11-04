import { getAuthSession } from '@/lib/auth';

export default async function Page() {
  // tests that scroll will not place Header out of view
  // let arr = [];
  // for (let i = 0; i < 100; i++) {
  //   arr.push(i + 1);
  // }

  try {
    const session = await getAuthSession();

    if (session) {
      return (
        <div>
          <p>{`User's Wall (Logged in)`}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>{`Landing Page (Not logged in)`}</p>
          {/* tests that scroll will not place Header out of view */}
          {/* {arr.map((item, index) => (
        <p key={index}>This is element {item}.</p>
      ))} */}
        </div>
      );
    }
  } catch (e) {
    console.error(e);
  }
}
