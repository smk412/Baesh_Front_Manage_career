import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, value, maxLength, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // 외부 ref를 내부 textareaRef와 동기화
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // 텍스트 영역의 높이를 내용에 맞게 자동으로 조절하는 효과
    React.useEffect(() => {
      if (textareaRef.current) {
        // 높이를 'auto'로 설정하여 내용이 줄어들 때 축소될 수 있도록 합니다.
        textareaRef.current.style.height = "auto";
        // scrollHeight를 기반으로 높이를 설정합니다.
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, [value]); // value가 변경될 때마다 이 효과를 실행합니다.

    const currentLength = value ? value.length : 0;
    const isOverMax = maxLength !== undefined && currentLength > maxLength;

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      // 외부 onChange 핸들러가 제공된 경우 호출합니다.
      // HTML의 maxLength 속성이 이미 입력 길이를 제한하므로,
      // 여기서 추가적인 길이 제한 로직은 필요하지 않습니다.
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div className="relative w-full md:10px"> {/* 글자 수 표시를 위한 상대 위치 컨테이너 */}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "resize-none overflow-hidden", // 조절 핸들 제거, 스크롤바 숨기기, 글자 수 공간을 위한 하단 패딩 추가
            className
          )}
          ref={textareaRef} // 내부 ref 사용
          onChange={handleChange}
          value={value} // App 컴포넌트에서 제어되는 값
          maxLength={maxLength} // HTML maxLength 속성 추가
          {...props}
        />
        {maxLength !== undefined && (
          <div
            className={cn(
                "text-right text-xs mt-1", // 우측 정렬, 상단 여백 추가
                isOverMax ? "text-red-500" : "text-gray-500"
             )
            }
          >
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
